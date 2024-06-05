#!/bin/bash

# Define variables
SUBSCRIPTION_ID="6efa34a0-28d3-4dee-835f-bdeef50c667b"
RESOURCE_GROUP="DistributedFinal"
VENDOR="euDistVendor"
# az appservice plan create --name euServicePlan --resource-group $RESOURCE_GROUP --sku F1  --location westeurope --is-linux
# az appservice plan create --name usServicePlan --resource-group $RESOURCE_GROUP --sku F1  --location eastus --is-linux
# az appservice plan create --name inServicePlan --resource-group $RESOURCE_GROUP --sku F1  --location centralindia --is-linux


for i in {1..1}; do
    az webapp create --resource-group $RESOURCE_GROUP --plan euServicePlan --name $VENDOR-$i --container-image-name distimgs.azurecr.io/flask-api:latest
    az webapp config appsettings set --resource-group euServicePlan --name $VENDOR-$i --settings VENDOR_NUMBER=$i

    id=$(az identity show --resource-group $RESOURCE_GROUP --name distID --query id --output tsv)
    az webapp identity assign --resource-group $RESOURCE_GROUP --name $VENDOR-$i --identities $id
    
    appConfig=$(az webapp config show --resource-group $RESOURCE_GROUP --name $VENDOR-$i --query id --output tsv)
    az resource update --ids $appConfig --set properties.acrUseManagedIdentityCreds=True

    clientId=$(az identity show --resource-group $RESOURCE_GROUP --name distID --query clientId --output tsv)
    az resource update --ids $appConfig --set properties.AcrUserManagedIdentityID=$clientId

    # cicdUrl=$(az webapp deployment container config --enable-cd true --name $VENDOR-$i --resource-group $RESOURCE_GROUP --query CI_CD_URL --output tsv)
    # az acr webhook create --name appserviceCD$VENDOR$i --registry distimgs --uri $cicdUrl --actions push --scope flask-api:latest
done
