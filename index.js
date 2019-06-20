var AWS = require('aws-sdk');

exports.handler = async (event,context) => {
    

console.log("\n\nLoading handler\n\n");
let ec2 = new AWS.EC2();
const promiseRegions =  await ec2.describeRegions().promise();

let cntRegions=promiseRegions.Regions.length;
console.log(`cntRegions=${cntRegions}`);

//let secGroupList='{"SecurityGroups":[ ';
let secGroupListJSON={};
let data=[];
secGroupListJSON.data=data;

for (let j=0;j<cntRegions;j++){

    //AWS.config.region = 'us-east-2';
    AWS.config.region = promiseRegions.Regions[j].RegionName;
    console.log(`AWS.config.region=${AWS.config.region}`);
    
    const promiseResponse =  await ec2.describeSecurityGroups().promise();
    console.log(promiseRegions);
    
    
    console.log("\n\nLoading finished\n\n");
    let cntSecurityGroups=promiseResponse.SecurityGroups.length;
    for (let i=0;i<cntSecurityGroups;i++){
        //secGroupList+='{"GroupName": "'+promiseResponse.SecurityGroups[i].GroupName+'"}';
        let groupInfo={
            "type:": "security-groups",
            "GroupName": promiseResponse.SecurityGroups[i].GroupName,
            "region": promiseRegions.Regions[j].RegionName
        };
        secGroupListJSON.data.push(groupInfo);
        
        //if (i<cntSecurityGroups-1) secGroupList+=','
    };
};
//secGroupList+=']}';
//console.log(`secGroupList: ${secGroupList}`);
//console.log(secGroupList);
const response = {
    statusCode: 200,
    body: JSON.stringify(secGroupListJSON,null,2),
};
//console.log("\n\n",response,"\n\n");
return response;
};