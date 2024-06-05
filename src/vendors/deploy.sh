#!/bin/bash

# Define variables
# az appservice plan create --name euServicePlan --resource-group $RESOURCE_GROUP --sku F1  --location westeurope --is-linux
# az appservice plan create --name usServicePlan --resource-group $RESOURCE_GROUP --sku F1  --location eastus --is-linux
# az appservice plan create --name inServicePlan --resource-group $RESOURCE_GROUP --sku F1  --location centralindia --is-linux
# az appservice plan create --name asServicePlan --resource-group $RESOURCE_GROUP --sku B1  --location swedencentral --is-linux
SUBSCRIPTION_ID="6efa34a0-28d3-4dee-835f-bdeef50c667b"
RESOURCE_GROUP="DistributedFinal"
VENDOR="euDistVendor"


# for i in {1..5}; do
#     az webapp create --resource-group $RESOURCE_GROUP --plan euServicePlan --name $VENDOR-$i --container-image-name distimgs.azurecr.io/flask-api:latest
#     az webapp config appsettings set --resource-group $RESOURCE_GROUP --name $VENDOR-$i --settings VENDOR_NUMBER=$i

#     id=$(az identity show --resource-group $RESOURCE_GROUP --name distID --query id --output tsv)
#     az webapp identity assign --resource-group $RESOURCE_GROUP --name $VENDOR-$i --identities $id
    
#     appConfig=$(az webapp config show --resource-group $RESOURCE_GROUP --name $VENDOR-$i --query id --output tsv)
#     az resource update --ids $appConfig --set properties.acrUseManagedIdentityCreds=True

#     clientId=$(az identity show --resource-group $RESOURCE_GROUP --name distID --query clientId --output tsv)
#     az resource update --ids $appConfig --set properties.AcrUserManagedIdentityID=$clientId

# done

VENDOR="asDistVendor"

for i in {6..10}; do
    az webapp create --resource-group $RESOURCE_GROUP --plan asServicePlan --name $VENDOR-$i --container-image-name distimgs.azurecr.io/flask-api:latest
    az webapp config appsettings set --resource-group $RESOURCE_GROUP --name $VENDOR-$i --settings VENDOR_NUMBER=$i

    id=$(az identity show --resource-group $RESOURCE_GROUP --name distID --query id --output tsv)
    az webapp identity assign --resource-group $RESOURCE_GROUP --name $VENDOR-$i --identities $id
    
    appConfig=$(az webapp config show --resource-group $RESOURCE_GROUP --name $VENDOR-$i --query id --output tsv)
    az resource update --ids $appConfig --set properties.acrUseManagedIdentityCreds=True

    clientId=$(az identity show --resource-group $RESOURCE_GROUP --name distID --query clientId --output tsv)
    az resource update --ids $appConfig --set properties.AcrUserManagedIdentityID=$clientId

done

VENDOR="inDistVendor"


for i in {11..15}; do
    az webapp create --resource-group $RESOURCE_GROUP --plan inServicePlan --name $VENDOR-$i --container-image-name distimgs.azurecr.io/flask-api:latest
    az webapp config appsettings set --resource-group $RESOURCE_GROUP --name $VENDOR-$i --settings VENDOR_NUMBER=$i

    id=$(az identity show --resource-group $RESOURCE_GROUP --name distID --query id --output tsv)
    az webapp identity assign --resource-group $RESOURCE_GROUP --name $VENDOR-$i --identities $id
    
    appConfig=$(az webapp config show --resource-group $RESOURCE_GROUP --name $VENDOR-$i --query id --output tsv)
    az resource update --ids $appConfig --set properties.acrUseManagedIdentityCreds=True

    clientId=$(az identity show --resource-group $RESOURCE_GROUP --name distID --query clientId --output tsv)
    az resource update --ids $appConfig --set properties.AcrUserManagedIdentityID=$clientId

done

VENDOR="usDistVendor"


for i in {16..20}; do
    az webapp create --resource-group $RESOURCE_GROUP --plan usServicePlan --name $VENDOR-$i --container-image-name distimgs.azurecr.io/flask-api:latest
    az webapp config appsettings set --resource-group $RESOURCE_GROUP --name $VENDOR-$i --settings VENDOR_NUMBER=$i

    id=$(az identity show --resource-group $RESOURCE_GROUP --name distID --query id --output tsv)
    az webapp identity assign --resource-group $RESOURCE_GROUP --name $VENDOR-$i --identities $id
    
    appConfig=$(az webapp config show --resource-group $RESOURCE_GROUP --name $VENDOR-$i --query id --output tsv)
    az resource update --ids $appConfig --set properties.acrUseManagedIdentityCreds=True

    clientId=$(az identity show --resource-group $RESOURCE_GROUP --name distID --query clientId --output tsv)
    az resource update --ids $appConfig --set properties.AcrUserManagedIdentityID=$clientId

done