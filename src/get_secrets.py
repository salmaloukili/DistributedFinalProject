import requests
import json

sources = [
    "indistvendor-14.azurewebsites.net",
    "indistvendor-13.azurewebsites.net",
    "indistvendor-15.azurewebsites.net",
    "indistvendor-11.azurewebsites.net",
    "indistvendor-12.azurewebsites.net",
    "usdistvendor-19.azurewebsites.net",
    "usdistvendor-18.azurewebsites.net",
    "usdistvendor-20.azurewebsites.net",
    "usdistvendor-17.azurewebsites.net",
    "usdistvendor-16.azurewebsites.net",
    "eudistvendor-5.azurewebsites.net",
    "eudistvendor-2.azurewebsites.net",
    "eudistvendor-1.azurewebsites.net",
    "eudistvendor-3.azurewebsites.net",
    "eudistvendor-4.azurewebsites.net",
    "asdistvendor-8.azurewebsites.net",
    "asdistvendor-6.azurewebsites.net",
    "asdistvendor-7.azurewebsites.net",
    "asdistvendor-9.azurewebsites.net",
    "asdistvendor-10.azurewebsites.net",
]


def get_secrets():
    password = "secretKey1234"
    all_secrets = []

    for source in sources:
        base_url = f"https://{source}"
        try:
            response = requests.get(
                f"{base_url}/api/secrets?password={password}", timeout=5
            )
        except:
            continue
        if response.status_code == 200:
            secret = response.json()
            secret["VENDOR_NAME"] = source.split(".")[0]
            secret["VENDOR_URL"] = base_url
            all_secrets.append(secret)
        else:
            print(
                f"Failed to get response for {source}, status code: {response.status_code}"
            )

    return all_secrets


def save_secrets_to_file(secrets):
    with open("secrets.json", "w") as file:
        json.dump(secrets, file, indent=4)


save_secrets_to_file(get_secrets())
