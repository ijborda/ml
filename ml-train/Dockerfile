FROM python:3.11-slim

WORKDIR /app

ENV PYTHONUNBUFFERED=1

VOLUME ["/app/data", "/app/ml-api/models"]

COPY ml-api/requirements.txt ./ml-api/requirements.txt
RUN pip install --no-cache-dir -r ml-api/requirements.txt

COPY ml-train/marito-or-not.py ./ml-train/marito-or-not.py

ENTRYPOINT ["python", "ml-train/marito-or-not.py"]