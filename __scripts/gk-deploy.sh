#!/usr/bin/env bash

if [ "$1" == "all" ]; then
  /bin/bash /opt/gimmekeys/__scripts/gk-deploy-api.sh
  /bin/bash /opt/gimmekeys/__scripts/gk-deploy-backend.sh
  /bin/bash /opt/gimmekeys/__scripts/gk-deploy-frontend.sh
elif [ "$1" == "api" ]; then
  /bin/bash /opt/gimmekeys/__scripts/gk-deploy-api.sh
elif [ "$1" == "backend" ]; then
  /bin/bash /opt/gimmekeys/__scripts/gk-deploy-backend.sh
elif [ "$1" == "frontend" ]; then
  /bin/bash /opt/gimmekeys/__scripts/gk-deploy-frontend.sh
else
  echo "Usage: gk-deploy all|api|backend|frontend"
fi
