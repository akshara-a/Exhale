#!/usr/bin/env bash
set -e

echo "=========================================================="
echo "  EXHALE - GROUNDING PROTOCOL (V2 RUNTIME INITIATED)      "
echo "  Privacy-First | Zero-Retention | High-Speed AI Engine   "
echo "=========================================================="

PORT="${PORT:-8000}"
MODEL="${OLLAMA_MODEL:-hermes3:latest}"
export OLLAMA_HOST="127.0.0.1:11434"

# 1. Detect Container Memory Limit (cgroups v1 & v2)
CONTAINER_MEM_BYTES=0
if [ -f /sys/fs/cgroup/memory.max ]; then
    VAL=$(cat /sys/fs/cgroup/memory.max 2>/dev/null || echo "max")
    if [ "$VAL" != "max" ]; then
        CONTAINER_MEM_BYTES=$VAL
    fi
elif [ -f /sys/fs/cgroup/memory/memory.limit_in_bytes ]; then
    VAL=$(cat /sys/fs/cgroup/memory/memory.limit_in_bytes 2>/dev/null || echo 0)
    # Check if value is reasonable (less than 1TB)
    if [ "$VAL" -gt 0 ] && [ "$VAL" -lt 1000000000000 ] 2>/dev/null; then
        CONTAINER_MEM_BYTES=$VAL
    fi
fi

# Fallback to /proc/meminfo if cgroups are unconstrained
if [ "$CONTAINER_MEM_BYTES" -eq 0 ]; then
    TOTAL_RAM_KB=$(grep MemTotal /proc/meminfo 2>/dev/null | awk '{print $2}' || echo 0)
    CONTAINER_MEM_BYTES=$((TOTAL_RAM_KB * 1024))
fi

MEM_MB=$((CONTAINER_MEM_BYTES / 1024 / 1024))
echo "Container Memory Limit: ${MEM_MB} MB detected."

# 2. Determine Ollama Daemon Policy
SHOULD_RUN_OLLAMA=true

if [ "${ENABLE_OLLAMA:-false}" = "false" ]; then
    echo "ENABLE_OLLAMA is 'false'. Bypassing local Ollama daemon."
    SHOULD_RUN_OLLAMA=false
else
    # Memory optimization for Render Free Tier (512MB RAM):
    # hermes3:latest (8B) is 4.7GB, which triggers a Linux kernel OOM-killer SIGKILL on 512MB RAM.
    # On low-RAM containers (< 2GB RAM), we auto-adapt the default model to qwen2.5:0.5b (~390MB),
    # which fits inside 512MB RAM and enables Ollama to run reliably without crashing!
    if [ "$CONTAINER_MEM_BYTES" -lt 2147483648 ] && [ "$MODEL" = "hermes3:latest" ]; then
        echo "[Ollama Adaptation] Low memory environment detected (${MEM_MB} MB)."
        echo "                    hermes3:latest (4.7GB) requires >= 4GB RAM to prevent OOM."
        echo "                    Switching default to ultra-compact SLM: qwen2.5:0.5b (390MB)."
        MODEL="qwen2.5:0.5b"
    fi
fi

if [ "$SHOULD_RUN_OLLAMA" = "true" ]; then
    echo "[1/3] Booting Ollama daemon (optimized for constrained RAM)..."
    export OLLAMA_NUM_PARALLEL=1
    export OLLAMA_MAX_LOADED_MODELS=1
    export OLLAMA_MAX_QUEUE=1
    export OLLAMA_KEEP_ALIVE=24h

    ollama serve > /var/log/ollama.log 2>&1 &
    OLLAMA_PID=$!

    echo "[2/3] Awaiting Ollama socket readiness..."
    COUNTER=0
    until curl -s "http://${OLLAMA_HOST}/api/tags" > /dev/null 2>&1; do
        sleep 1
        COUNTER=$((COUNTER + 1))
        if [ "$COUNTER" -ge 30 ]; then
            echo "Ollama socket timeout; proceeding with cloud/in-memory circuit breaker."
            break
        fi
    done
    echo "Ollama active (PID: $OLLAMA_PID). Initiating model pull in background: $MODEL..."
    ollama pull "$MODEL" > /var/log/ollama_pull.log 2>&1 &
else
    echo "[1/3] High-Speed Architecture engaged:"
    echo "      - Tier 1: Free Open-Weight Cloud (Groq Dynamic LPUs, ~400ms latency, zero OOM)"
    echo "      - Tier 2: Deterministic In-Memory Neuro-Cultural Engine (0ms latency, volatile RAM)"
fi

echo "[3/3] Starting Exhale FastAPI on port $PORT..."
exec uvicorn app.main:app --host 0.0.0.0 --port "$PORT"
