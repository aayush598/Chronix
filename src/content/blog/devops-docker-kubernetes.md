---
title: "Modern DevOps: Docker to Kubernetes Production Deployment Guide"
description: "Complete guide to containerizing applications with Docker and orchestrating them with Kubernetes for production-ready deployments."
pubDate: "2024-01-05"
category: "DevOps"
author:
  name: "David Kim"
  bio: "DevOps Engineer & Cloud Architect"
  avatar: "/author.jpg"
tags: ["devops", "docker", "kubernetes", "containerization", "deployment"]
readTime: 18
version: "2.0"
likes: 134
shares: 67
---

# Modern DevOps: Docker to Kubernetes Production Deployment Guide

Containerization has revolutionized how we deploy and manage applications. This comprehensive guide walks you through the entire journey from containerizing your application with Docker to orchestrating it with Kubernetes in production.

## Understanding Containerization Fundamentals

### What Are Containers?

Containers package applications with all their dependencies, creating portable and consistent environments across development, testing, and production.

### Docker vs Virtual Machines

```bash
# Resource comparison
Virtual Machines:
- Full OS per VM
- Higher resource usage
- Slower startup times
- Strong isolation

Containers:
- Shared OS kernel
- Lower resource usage  
- Fast startup times
- Process-level isolation
```

## Docker Essentials

### Creating Your First Dockerfile

```dockerfile
# Multi-stage build for Node.js application
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS production

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Set working directory
WORKDIR /app

# Copy built application from builder stage
COPY --from=builder --chown=nextjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Start the application
CMD ["npm", "start"]
```

### Docker Compose for Development

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: 
      context: .
      dockerfile: Dockerfile
      target: development
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
      - DB_HOST=postgres
      - REDIS_HOST=redis
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_started
    networks:
      - app-network

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: appuser
      POSTGRES_PASSWORD: apppass
      POSTGRES_DB: appdb
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U appuser -d appdb"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - app-network

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - app-network

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - app
    networks:
      - app-network

volumes:
  postgres_data:
  redis_data:

networks:
  app-network:
    driver: bridge
```

### Nginx Configuration

```nginx
# nginx.conf
events {
    worker_connections 1024;
}

http {
    upstream app {
        server app:3000;
    }

    server {
        listen 80;
        server_name localhost;

        location / {
            proxy_pass http://app;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        location /health {
            access_log off;
            proxy_pass http://app;
        }
    }
}
```

## Advanced Docker Techniques

### Optimizing Docker Images

```dockerfile
# Optimized Python application Dockerfile
FROM python:3.11-slim AS base

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# Create non-root user
RUN useradd --create-home --shell /bin/bash app

# Copy application code
COPY --chown=app:app . .

USER app

EXPOSE 8000

CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "4", "app:app"]
```

### Docker Image Security Best Practices

```dockerfile
# Security-focused Dockerfile
FROM node:18-alpine

# Install security updates
RUN apk upgrade --no-cache

# Create non-root user with specific UID/GID
RUN addgroup -g 10001 -S appgroup \
    && adduser -u 10001 -S -G appgroup -h /app appuser

# Set secure working directory
WORKDIR /app

# Copy package files as root, install as user
COPY package*.json ./
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy application files
COPY --chown=appuser:appgroup . .

# Remove unnecessary packages
USER root
RUN apk del --no-cache git curl

USER appuser

# Set secure file permissions
RUN chmod -R 755 /app

EXPOSE 3000

CMD ["npm", "start"]
```

## Kubernetes Fundamentals

### Kubernetes Architecture Overview

```yaml
# Kubernetes cluster components:
# - Master Node: API Server, etcd, Controller Manager, Scheduler
# - Worker Nodes: kubelet, kube-proxy, Container Runtime
# - Pods: Smallest deployable units
# - Services: Network abstraction for pod access
# - Ingress: External access to services
```

### Basic Pod Configuration

```yaml
# pod.yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-app-pod
  labels:
    app: my-app
    version: v1
spec:
  containers:
  - name: app
    image: my-app:latest
    ports:
    - containerPort: 3000
    env:
    - name: NODE_ENV
      value: "production"
    - name: DB_HOST
      valueFrom:
        secretKeyRef:
          name: db-secret
          key: host
    resources:
      requests:
        memory: "128Mi"
        cpu: "100m"
      limits:
        memory: "256Mi"
        cpu: "200m"
    livenessProbe:
      httpGet:
        path: /health
        port: 3000
      initialDelaySeconds: 30
      periodSeconds: 10
    readinessProbe:
      httpGet:
        path: /ready
        port: 3000
      initialDelaySeconds: 5
      periodSeconds: 5
```

## Production-Ready Kubernetes Deployments

### Deployment Configuration

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app-deployment
  labels:
    app: my-app
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 1
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
        version: v1
    spec:
      containers:
      - name: app
        image: my-app:v1.0.0
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: database-url
        resources:
          requests:
            memory: "256Mi"
            cpu: "200m"
          limits:
            memory: "512Mi"
            cpu: "400m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 10
          periodSeconds: 5
          timeoutSeconds: 3
          failureThreshold: 3
      imagePullSecrets:
      - name: registry-secret
```

### Service Configuration

```yaml
# service.yaml
apiVersion: v1
kind: Service
metadata:
  name: my-app-service
  labels:
    app: my-app
spec:
  selector:
    app: my-app
  ports:
  - name: http
    port: 80
    targetPort: 3000
    protocol: TCP
  type: ClusterIP
---
# Headless service for StatefulSet
apiVersion: v1
kind: Service
metadata:
  name: my-app-headless
  labels:
    app: my-app
spec:
  clusterIP: None
  selector:
    app: my-app
  ports:
  - name: http
    port: 3000
    targetPort: 3000
```

### Ingress Configuration

```yaml
# ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: my-app-ingress
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/rate-limit: "100"
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
spec:
  tls:
  - hosts:
    - myapp.example.com
    secretName: my-app-tls
  rules:
  - host: myapp.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: my-app-service
            port:
              number: 80
```

## Configuration Management

### ConfigMaps and Secrets

```yaml
# configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  app.properties: |
    server.port=3000
    app.name=My Application
    log.level=info
  nginx.conf: |
    server {
        listen 80;
        location / {
            proxy_pass http://localhost:3000;
        }
    }
---
# secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
type: Opaque
data:
  database-url: <base64-encoded-database-url>
  api-key: <base64-encoded-api-key>
stringData:
  username: admin
  password: secretpassword
```

### Using ConfigMaps and Secrets in Deployments

```yaml
# deployment-with-config.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
spec:
  template:
    spec:
      containers:
      - name: app
        image: my-app:latest
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: database-url
        - name: API_KEY
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: api-key
        volumeMounts:
        - name: config-volume
          mountPath: /etc/config
        - name: secret-volume
          mountPath: /etc/secrets
          readOnly: true
      volumes:
      - name: config-volume
        configMap:
          name: app-config
      - name: secret-volume
        secret:
          secretName: app-secrets
          defaultMode: 0600
```

## Persistent Storage

### PersistentVolume and PersistentVolumeClaim

```yaml
# storage.yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: app-pv
spec:
  capacity:
    storage: 10Gi
  accessModes:
    - ReadWriteOnce
  persistentVolumeReclaimPolicy: Retain
  storageClassName: fast-ssd
  hostPath:
    path: /data/app
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: app-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 5Gi
  storageClassName: fast-ssd
```

### StatefulSet with Persistent Storage

```yaml
# statefulset.yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: database
spec:
  serviceName: database-headless
  replicas: 3
  selector:
    matchLabels:
      app: database
  template:
    metadata:
      labels:
        app: database
    spec:
      containers:
      - name: postgres
        image: postgres:15
        env:
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: password
        volumeMounts:
        - name: data
          mountPath: /var/lib/postgresql/data
        resources:
          requests:
            memory: "1Gi"
            cpu: "500m"
          limits:
            memory: "2Gi"
            cpu: "1000m"
  volumeClaimTemplates:
  - metadata:
      name: data
    spec:
      accessModes: ["ReadWriteOnce"]
      storageClassName: fast-ssd
      resources:
        requests:
          storage: 20Gi
```

## Monitoring and Logging

### Prometheus Monitoring

```yaml
# monitoring.yaml
apiVersion: v1
kind: ServiceMonitor
metadata:
  name: app-metrics
  labels:
    app: my-app
spec:
  selector:
    matchLabels:
      app: my-app
  endpoints:
  - port: metrics
    interval: 30s
    path: /metrics
---
# Add metrics endpoint to service
apiVersion: v1
kind: Service
metadata:
  name: my-app-service
  labels:
    app: my-app
spec:
  selector:
    app: my-app
  ports:
  - name: http
    port: 80
    targetPort: 3000
  - name: metrics
    port: 9090
    targetPort: 9090
```

### Logging with Fluentd

```yaml
# fluentd-configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: fluentd-config
data:
  fluent.conf: |
    <source>
      @type tail
      path /var/log/containers/*my-app*.log
      pos_file /var/log/fluentd-containers.log.pos
      tag kubernetes.*
      read_from_head true
      format json
    </source>
    
    <match kubernetes.**>
      @type elasticsearch
      host elasticsearch.logging.svc.cluster.local
      port 9200
      index_name fluentd
      type_name fluentd
    </match>
```

## CI/CD Pipeline

### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Build and Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  build:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    steps:
    - name: Checkout repository
      uses: actions/checkout@v4

    - name: Log in to Container Registry
      uses: docker/login-action@v3
      with:
        registry: ${{ env.REGISTRY }}
        username: ${{ github.actor }}
        password: ${{ secrets.GITHUB_TOKEN }}

    - name: Extract metadata
      id: meta
      uses: docker/metadata-action@v5
      with:
        images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
        tags: |
          type=ref,event=branch
          type=ref,event=pr
          type=sha,prefix={{branch}}-

    - name: Build and push Docker image
      uses: docker/build-push-action@v5
      with:
        context: .
        push: true
        tags: ${{ steps.meta.outputs.tags }}
        labels: ${{ steps.meta.outputs.labels }}
        cache-from: type=gha
        cache-to: type=gha,mode=max

    - name: Deploy to Kubernetes
      if: github.ref == 'refs/heads/main'
      run: |
        echo "${{ secrets.KUBE_CONFIG }}" | base64 -d > kubeconfig
        export KUBECONFIG=kubeconfig
        
        # Update image in deployment
        kubectl set image deployment/my-app-deployment \
          app=${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }}
        
        # Wait for rollout
        kubectl rollout status deployment/my-app-deployment
        
        # Verify deployment
        kubectl get pods -l app=my-app
```

### Helm Charts for Easy Deployment

```yaml
# Chart.yaml
apiVersion: v2
name: my-app
description: A Helm chart for my application
version: 0.1.0
appVersion: 1.0.0

# values.yaml
replicaCount: 3

image:
  repository: my-app
  pullPolicy: IfNotPresent
  tag: latest

service:
  type: ClusterIP
  port: 80
  targetPort: 3000

ingress:
  enabled: true
  className: nginx
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
  hosts:
    - host: myapp.example.com
      paths:
        - path: /
          pathType: Prefix
  tls:
    - secretName: my-app-tls
      hosts:
        - myapp.example.com

resources:
  limits:
    cpu: 500m
    memory: 512Mi
  requests:
    cpu: 200m
    memory: 256Mi

autoscaling:
  enabled: true
  minReplicas: 3
  maxReplicas: 10
  targetCPUUtilizationPercentage: 70
```

## Security Best Practices

### Pod Security Standards

```yaml
# pod-security-policy.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: production
  labels:
    pod-security.kubernetes.io/enforce: restricted
    pod-security.kubernetes.io/audit: restricted
    pod-security.kubernetes.io/warn: restricted
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: secure-app
  namespace: production
spec:
  template:
    spec:
      securityContext:
        runAsNonRoot: true
        runAsUser: 10001
        runAsGroup: 10001
        fsGroup: 10001
        seccompProfile:
          type: RuntimeDefault
      containers:
      - name: app
        securityContext:
          allowPrivilegeEscalation: false
          readOnlyRootFilesystem: true
          capabilities:
            drop:
            - ALL
        volumeMounts:
        - name: tmp
          mountPath: /tmp
        - name: var-run
          mountPath: /var/run
      volumes:
      - name: tmp
        emptyDir: {}
      - name: var-run
        emptyDir: {}
```

### Network Policies

```yaml
# network-policy.yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: deny-all
  namespace: production
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  - Egress
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-app-communication
  namespace: production
spec:
  podSelector:
    matchLabels:
      app: my-app
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: ingress-nginx
    - podSelector:
        matchLabels:
          app: my-app
    ports:
    - protocol: TCP
      port: 3000
  egress:
  - to:
    - podSelector:
        matchLabels:
          app: database
    ports:
    - protocol: TCP
      port: 5432
```

## Production Checklist

### Pre-deployment Validation

```bash
#!/bin/bash
# pre-deploy-check.sh

echo "🔍 Running pre-deployment checks..."

# Check cluster connectivity
kubectl cluster-info || exit 1

# Validate YAML manifests
kubectl apply --dry-run=client -f k8s/ || exit 1

# Check resource quotas
kubectl describe resourcequota -n production

# Verify secrets exist
kubectl get secret app-secrets -n production || exit 1

# Check persistent volumes
kubectl get pv,pvc -n production

# Validate ingress configuration
kubectl get ingress -n production -o yaml | grep -E "host:|secretName:"

# Test service endpoints
kubectl get endpoints -n production

echo "✅ All checks passed!"
```

### Deployment Script

```bash
#!/bin/bash
# deploy.sh

set -e

NAMESPACE=${1:-production}
IMAGE_TAG=${2:-latest}

echo "🚀 Deploying to namespace: $NAMESPACE with image tag: $IMAGE_TAG"

# Update image tag in deployment
kubectl set image deployment/my-app-deployment \
  app=my-app:$IMAGE_TAG \
  -n $NAMESPACE

# Wait for rollout to complete
kubectl rollout status deployment/my-app-deployment -n $NAMESPACE --timeout=300s

# Verify deployment
echo "🔍 Verifying deployment..."
kubectl get pods -l app=my-app -n $NAMESPACE
kubectl get svc my-app-service -n $NAMESPACE
kubectl get ingress -n $NAMESPACE

# Run smoke tests
echo "🧪 Running smoke tests..."
kubectl run smoke-test \
  --rm -i --tty \
  --image=curlimages/curl \
  --restart=Never \
  -- curl -f http://my-app-service.$NAMESPACE.svc.cluster.local/health

echo "✅ Deployment successful!"
```

## Conclusion

This comprehensive guide covers the essential aspects of modern containerization and orchestration:

1. **Docker fundamentals** and best practices for creating efficient, secure images
2. **Kubernetes architecture** and core components
3. **Production-ready deployments** with proper resource management and health checks
4. **Configuration management** using ConfigMaps and Secrets
5. **Persistent storage** solutions for stateful applications
6. **Monitoring and logging** strategies
7. **CI/CD pipelines** for automated deployments
8. **Security best practices** including pod security and network policies

The journey from Docker to Kubernetes represents a significant step in application maturity, providing scalability, reliability, and maintainability that modern applications demand. Start with Docker to containerize your applications, then gradually adopt Kubernetes as your orchestration needs grow.

Remember that this is an iterative process—begin with basic deployments and gradually implement advanced features like auto-scaling, service mesh, and multi-cluster deployments as your expertise and requirements evolve.