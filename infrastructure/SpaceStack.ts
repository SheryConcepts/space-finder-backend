import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { RestApi } from 'aws-cdk-lib/aws-apigateway';
import { GenericTable } from './GenericTable';
import { Spacer } from 'aws-cdk-lib/aws-cloudwatch';

export class SpaceStack extends  Stack {

    private api = new RestApi(this, 'SpaceApi');

    private spacestable = new GenericTable(this, {
        tableName: "SpacesTable",
        primaryKey: "spaceId",
        createLambdaPath: "Create",
        readLambdaPath: "Read",
        updateLambdaPath: "Update",
        deleteLambdaPath: "Delete",
        secondaryIndexes: ['location']
    })

    constructor(scope: Construct, id: string, props?: StackProps ) {
        super(scope, id, props);


        // Spaces API integrations:
       const spacesResource = this.api.root.addResource('spaces'); 
       spacesResource.addMethod('POST', this.spacestable.createLambdaIntegration)
       spacesResource.addMethod('GET', this.spacestable.readLambdaIntegration)
       spacesResource.addMethod('PUT', this.spacestable.updateLambdaIntegration)
       spacesResource.addMethod('DELETE', this.spacestable.deleteLambdaIntegration)


    }


}