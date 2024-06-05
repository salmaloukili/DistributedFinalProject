#!/bin/bash

# Define variables
SUBSCRIPTION_ID="6efa34a0-28d3-4dee-835f-bdeef50c667b"
RESOURCE_GROUP="DistributedFinal"

az appservice plan create --name AppServicePlan1 --resource-group $RESOURCE_GROUP --sku F1  --location francecentral --is-linux
for i in {1..1}; do
    az webapp create --resource-group $RESOURCE_GROUP --plan AppServicePlan1 --name vendor-$i --container-image-name distimgs.azurecr.io/flask-api:latest
    
    az webapp config appsettings set --resource-group $registry --name vendor-$i
    
    id=$(az identity show --resource-group $RESOURCE_GROUP --name distID --query id --output tsv)
    az webapp identity assign --resource-group $RESOURCE_GROUP --name vendor-$i --identities $id
    
    appConfig=$(az webapp config show --resource-group $RESOURCE_GROUP --name vendor-$i --query id --output tsv)
    az resource update --ids $appConfig --set properties.acrUseManagedIdentityCreds=True

    clientId=$(az identity show --resource-group $RESOURCE_GROUP --name distID --query clientId --output tsv)
    az resource update --ids $appConfig --set properties.AcrUserManagedIdentityID=$clientId

    cicdUrl=$(az webapp deployment container config --enable-cd true --name vendor-$i --resource-group $RESOURCE_GROUP --query CI_CD_URL --output tsv)
    az acr webhook create --name appserviceCD --registry distimgs --uri $cicdUrl --actions push --scope flask-api:latest

done

# az appservice plan create --name AppServicePlan1 --resource-group $RESOURCE_GROUP --sku F1  --location eastus --is-linux
# for i in {1..10}; do
#     az webapp create --resource-group $RESOURCE_GROUP --plan AppServicePlan$i --name your-api-instance-$i --deployment-container-image-name distimgs.azurecr.io/your-api-image
# done

# az appservice plan create --name AppServicePlan1 --resource-group $RESOURCE_GROUP --sku F1  --location asia --is-linux
# for i in {1..10}; do
#     az webapp create --resource-group $RESOURCE_GROUP --plan AppServicePlan$i --name your-api-instance-$i --deployment-container-image-name distimgs.azurecr.io/your-api-image
# done

# az appservice plan create --name AppServicePlan1 --resource-group $RESOURCE_GROUP --sku F1  --location brazilsouth --is-linux
# for i in {1..10}; do
#     az webapp create --resource-group $RESOURCE_GROUP --plan AppServicePlan$i --name your-api-instance-$i --deployment-container-image-name distimgs.azurecr.io/your-api-image
# done
