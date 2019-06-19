var AWS = require('aws-sdk');
AWS.config.region = 'us-east-2';

exports.handler = async (event,context) => {
    console.log("\n\nLoading handler\n\n");
    let ec2 = new AWS.EC2();
    const promiseResponse =  await new Promise((res, rej) => {
        ec2.describeSecurityGroups( function(err, data) {
            console.log("\nIn describe instances:\n");
          if (err){ 
            console.log(err, err.stack); // an error occurred
            return rej(err);
          }
          else     {
              console.log("\n\n",data,"\n\n"); // successful response
              let obj = JSON.parse(JSON.stringify(data));
              console.log("\n\n",obj.Instances,"\n\n");
              res(obj);
          }
        })
    });
    
    console.log("\n\nLoading finished\n\n");
    let cntSecurityGroups=promiseResponse.SecurityGroups.length;
    let secGroupList='{"SecurityGroups":[ ';
    for (let i=0;i<cntSecurityGroups;i++){
        secGroupList+='{"GroupName": "'+promiseResponse.SecurityGroups[i].GroupName+'"}';
        if (i<cntSecurityGroups-1) secGroupList+=','
    }
    secGroupList+=']}';
    console.log(secGroupList);
    const response = {
        statusCode: 200,
        body: secGroupList,
    };
    console.log("\n\n",response,"\n\n");
    return response;
};