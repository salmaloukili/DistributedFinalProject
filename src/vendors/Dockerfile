FROM python:3.11-slim
WORKDIR /home/vendors
COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt
COPY . .
EXPOSE 80
CMD ["flask", "run", "--host=0.0.0.0" ,"--port=80"]
