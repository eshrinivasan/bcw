#!/bin/bash


CopyToS3BuildBucket () {

		bucketFolder=$1
		echo "Copying to S3 build bucket with $HTTP_PROXY"
		#if s3 bucket does not exist, copy the build to bucket.
        aws s3 ls s3://${bucketFolder}/ |grep brokercheckwidget2210
        if [ "$?" = "1" ]; then
				echo "Copying to S3 bucket folder with build $buildLabel"
                aws s3 cp --sse  --recursive ./brokercheckwidget2210/ s3://${bucketFolder}/brokercheckwidget2210/
                if [ "$?" != "0" ]; then
                        echo "aws s3 command failed, exiting..."
                        exit 1
                fi
                sleep 10
 
                aws s3 cp --sse  --recursive ./app-stack/ s3://${bucketFolder}/app-stack/
                aws s3 cp --sse  --recursive ./bootstrap/ s3://${bucketFolder}/bootstrap/
        else
                echo "s3://${bucketFolder}/ exists "
        fi
}

region="$1"
buildLabel="`cat ./buildinfo|grep "@(#) Build ID:"|cut -f2 -d:|xargs`"
runlevel="$3"
componentName="$4"



if [ "$2" = "DEV" ]; then
        bucketFolder="4652-5751-2377-application-dev-staging/fnrw/$componentName/$buildLabel"
        ENV="DEV"
		
		export NO_PROXY="127.0.0.1, localhost, 169.254.169.254"
		export HTTP_PROXY=http://awsproxy.dev.aws.finra.org:3128/
		export HTTPS_PROXY=http://awsproxy.dev.aws.finra.org:3128/
		
elif [ "$2" = "QA" ]; then
		bucketFolder="1422-4800-0760-application-qa-staging/fnrw/$componentName/$buildLabel"
		ENV="QA"
		
		export NO_PROXY="127.0.0.1, localhost, 169.254.169.254"
		export HTTP_PROXY=http://awsproxy.qa.aws.finra.org:3128/
		export HTTPS_PROXY=http://awsproxy.qa.aws.finra.org:3128/

		
elif [ "$2" = "PROD" ]; then
		bucketFolder="5101-9919-3688-application-prod-staging/fnrw/$componentName/$buildLabel"
		ENV="PROD"
		
		export NO_PROXY="127.0.0.1, localhost, 169.254.169.254"
		export HTTP_PROXY=http://awsproxy.aws.finra.org:3128/
		export HTTPS_PROXY=http://awsproxy.aws.finra.org:3128/
fi

bucketFolder=${bucketFolder}-${ENV}

export AWS_DEFAULT_REGION=`curl -s http://169.254.169.254/latest/dynamic/instance-identity/document | grep region | awk -F\" '{print $4}'`

echo "http proxy:  $HTTP_PROXY"
echo "https proxy:  $HTTPS_PROXY"
echo "default region:  $AWS_DEFAULT_REGION"
echo "bucket folder:  $bucketFolder"
echo "region:  $region"
echo "component name: $componentName"
echo "runlevel:  $runlevel"

if [ -z "$AWS_DEFAULT_REGION" ]; then
        echo "Unable to set AWS Region, exiting..."
        exit 2
fi


echo "Installing FNRW brokercheckwidget2210 build $buildLabel."
		
CopyToS3BuildBucket $bucketFolder
	
unset HTTP_PROXY
unset HTTPS_PROXY
		
cd app-stack
python ./update.py  $ENV $buildLabel $region $componentName $runlevel
if [ "$?" != "0" ]; then
	echo "Failed to update brokercheckwidget2210 build $buildLabel."
	exit 1;
fi
		
echo "Done updating FNRW brokercheckwidget2210 with build $buildLabel. "




