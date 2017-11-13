#!/bin/bash

N=$1

PREVIOUS=`printf "%03d" $((N - 1))`
ACTUAL=`printf "%03d" $N`

cat <<EOF
  User${ACTUAL}:
    Type: AWS::IAM::User
    Properties:
      UserName: "serverless-cat-reader-user${ACTUAL}"
      LoginProfile:
        Password: !Ref "PASSWORD"
        PasswordResetRequired: true

  User${ACTUAL}Bucket:
    Type: AWS::S3::Bucket
    Properties:
      AccessControl: Private
      BucketName: "serverless-cat-reader-storage-user${ACTUAL}"
      Tags:
        - Key: Origin
          Value: Workshop-Cloudyna-2017

  User${ACTUAL}Table:
    Type: "AWS::DynamoDB::Table"
    DependsOn:
      - User${PREVIOUS}Table
    Properties:
      AttributeDefinitions:
        - AttributeName: "name"
          AttributeType: S
      KeySchema:
        - AttributeName: "name"
          KeyType: HASH
      ProvisionedThroughput:
        ReadCapacityUnits: 1
        WriteCapacityUnits: 1
      TableName: "serverless-cat-reader-table-user${ACTUAL}"
      Tags:
        - Key: Origin
          Value: Workshop-Cloudyna-2017
EOF