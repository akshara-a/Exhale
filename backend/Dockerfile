# ====================================================================
# Exhale - Grounding Protocol Backend (Render GPU Service)
# Privacy-First, Zero-Retention Mental Health Circuit Breaker
# ====================================================================

FROM python:3.12-slim-bookworm

ENV PYTHONUNBUFFERED=1 \
    DEBIAN_FRONTEND=noninteractive \
    OLLAMA_HOST=127.0.0.1:11434 \
    OLLAMA_MODEL=hermes3:latest \
    PORT=8000

# Install essential system dependencies, curl, and zstd (required by Ollama installer)
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    ca-certificates \
    procps \
    zstd \
    && rm -rf /var/lib/apt/lists/*

# Install official Ollama runtime (supports GPU passthrough on Render)
RUN curl -fsSL https://ollama.com/install.sh | sh

WORKDIR /app

# Install Python backend dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code and runner
COPY app/ ./app/
COPY start.sh .
RUN chmod +x start.sh

# Expose Render service port
EXPOSE 8000

# Launch Ollama background daemon + FastAPI uvicorn server
ENTRYPOINT ["./start.sh"]
