const sql = require('mssql/msnodesqlv8');
const csv = require('csv-parser');
const fs = require('fs');
const fastcsv = require('fast-csv');

// HELPER FUNCTIONS
getProjectVersions = () => {
  let projectVersions = [];
  fs.createReadStream('project-versions.csv')
  .pipe(csv({ separator: ',' }))
  .on('data', (data) => projectVersions.push(data))
  .on('end', () => console.log('Inputs: ', projectVersions));
  return projectVersions;
}

getDates = (issues, startDate, key, version) => {
	let completedStoryPoints = 0;
  let remainingStoryPoints = 0;
  let newStartDate = new Date();
  const todaysDate = new Date();
	issues.forEach((item) => {
    newStartDate > item.IssueUpdated ? newStartDate = item.IssueUpdated : ''; // Get the earliest date updated out of all the issues
    if(item.IssueStatusName === 'Done' || item.IssueStatusName === 'Closed' || item.IssueStatusName === 'Cancelled'){
      completedStoryPoints += item.StoryPoints;
    } else {
      remainingStoryPoints += item.StoryPoints;
    }
  });
  if ((completedStoryPoints + remainingStoryPoints)*0.10 > completedStoryPoints ) 
    throw 'ERROR: Not enough issues completed... Key: ' + key + ', Version: ' + version; // Check that 10% of the estimated work for the version is completed

  startDate === null ? '' : newStartDate = startDate; // If no start date was given, assign it to the earliest date any one of the issues got updated (assume this is when the version started)
  const daysBetween = Math.round((todaysDate.getTime() - newStartDate.getTime()) / (1000 * 3600 * 24));
  const pointsPerDay = completedStoryPoints / daysBetween;
  const daysToAdd = remainingStoryPoints / pointsPerDay;
  var predictedDate = new Date(todaysDate);
  predictedDate.setDate(predictedDate.getDate() + daysToAdd);

  return { StartDate: newStartDate, PredictedDate: predictedDate };
};

// MAIN
(async () => {

  // Read from csv file
  let projectVersions = getProjectVersions();

  // Database info
  const pool = new sql.ConnectionPool({
		database: "IMIT_ATLASSIAN_METRICS_T1",
		server: "CDCWVISSSWST005.americas.manulife.net\\ITS005",
		driver: "msnodesqlv8",
		options: {
			trustedConnection: true
		}
	});

  // Connect to database
	await pool.connect();
	console.log("Successfully connected to database...");

  // Set request object used for queries
  const request = new sql.Request(pool);
      
  var wrap = new Promise((resolve, reject) => {
    // Traverse through each project version in csv file
    projectVersions.forEach(async (item, index, array) => {
      try {
        const getVersionFromCsvQuery = `SELECT ProjectVersions.Id, Projects.Name Project, ProjectVersions.Name Version, ProjectVersions.StartDate FROM [IMIT_ATLASSIAN_METRICS_T1].[dbo].[ProjectVersions] ProjectVersions
          JOIN [IMIT_ATLASSIAN_METRICS_T1].[dbo].[Projects] Projects ON ProjectVersions.ProjectId=Projects.Id
          WHERE Projects.[Key]='${item.Key}' AND ProjectVersions.Name='${item.Version}'`;

        


        const resultVersion = await request.query(getVersionFromCsvQuery);
        
        // Check if no results were found
        if (resultVersion.recordset.length === 0 ) throw 'ERROR: Version not found... Key: ' + item.Key + ', Version: ' + item.Version;

        item.Id = resultVersion.recordset[0].Id;
        item.Project = resultVersion.recordset[0].Project;

        let startDate;
        resultVersion.recordset[0].StartDate === null ? startDate = null : startDate = new Date(resultVersion.recordset[0].StartDate); // If no start date was provided, assign it to null

        const getVersionIssuesQuery = `SELECT IssueDetails.IssueId, IssueDetails.[Key], IssueDetails.IssueTypeName, IssueDetails.IssueStatusName, IssueDetails.StoryPoints, IssueDetails.IssueCreated, IssueDetails.IssueUpdated  
          FROM [IMIT_ATLASSIAN_METRICS_T1].[dbo].[IssueDetails] IssueDetails 
          JOIN [IMIT_ATLASSIAN_METRICS_T1].[dbo].[ProjectVersionIssues] ProjectVersionIssues ON IssueDetails.IssueId=ProjectVersionIssues.IssueId 
          WHERE ProjectVersionIssues.VersionId=${item.Id} AND IssueDetails.IssueTypeName!='Sub-task'`;
        const resultIssues = await request.query(getVersionIssuesQuery);

        const obj = getDates(resultIssues.recordset, startDate, item.Key, item.Version);
        const dateFormat = { year: 'numeric', month: 'short', day: 'numeric' };
        item.StartDate = obj.StartDate.toLocaleDateString("en-US", dateFormat);
        item.PredictedDate = obj.PredictedDate.toLocaleDateString("en-US", dateFormat);
        

      } catch (err) {
        console.error(err);
      }
      if (index === array.length -1) resolve(); // Resolve promise when reach end of array 
    });
  });

  wrap.then(() => {
    pool.close(); // Close database connection
    fastcsv.write(projectVersions, { headers: true }).pipe(fs.createWriteStream("out.csv")); // Write results to csv file
    console.log("Script completed successfully! Open out.csv to view results.");
   });
})()