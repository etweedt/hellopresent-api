# hellopresent-api

## Docker

```
sudo docker build -t hellopresent-api .
sudo docker stop hellopresent-api && sudo docker rm hellopresent-api
sudo docker run -p 60001:5000 --name hellopresent-api --restart always -d hellopresent-api
```
