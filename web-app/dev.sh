#!/bin/bash
# FASTR Deck Builder - Dev Server Script
# Usage: ./dev.sh [start|stop|restart|status]

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

# Keep logs inside the repo — macOS periodically purges /tmp, which used to
# delete the log files out from under long-running servers.
LOG_DIR="$SCRIPT_DIR/.logs"
mkdir -p "$LOG_DIR"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

stop_servers() {
    echo -e "${YELLOW}Stopping servers...${NC}"
    pkill -f "tsx watch server/index.ts" 2>/dev/null
    pkill -f "vite.*fastr" 2>/dev/null
    lsof -ti:3001 | xargs kill -9 2>/dev/null
    lsof -ti:5173 | xargs kill -9 2>/dev/null
    sleep 1
    echo -e "${GREEN}Servers stopped${NC}"
}

start_servers() {
    echo -e "${YELLOW}Starting backend (port 3001)...${NC}"
    npm run dev > $LOG_DIR/backend.log 2>&1 &
    sleep 2

    if lsof -i:3001 > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Backend running on http://localhost:3001${NC}"
    else
        echo -e "${RED}✗ Backend failed to start. Check $LOG_DIR/backend.log${NC}"
        return 1
    fi

    echo -e "${YELLOW}Starting frontend (port 5173)...${NC}"
    cd client && npm run dev > $LOG_DIR/frontend.log 2>&1 &
    sleep 2

    if lsof -i:5173 > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Frontend running on http://localhost:5173${NC}"
    else
        echo -e "${RED}✗ Frontend failed to start. Check $LOG_DIR/frontend.log${NC}"
        return 1
    fi

    echo ""
    echo -e "${GREEN}=== Dev servers ready ===${NC}"
    echo -e "Open ${GREEN}http://localhost:5173/${NC} in your browser"
    echo ""
    echo "Logs:"
    echo "  Backend:  tail -f $LOG_DIR/backend.log"
    echo "  Frontend: tail -f $LOG_DIR/frontend.log"
}

show_status() {
    echo "=== Server Status ==="
    if lsof -i:3001 > /dev/null 2>&1; then
        echo -e "Backend (3001):  ${GREEN}RUNNING${NC}"
    else
        echo -e "Backend (3001):  ${RED}STOPPED${NC}"
    fi

    if lsof -i:5173 > /dev/null 2>&1; then
        echo -e "Frontend (5173): ${GREEN}RUNNING${NC}"
    else
        echo -e "Frontend (5173): ${RED}STOPPED${NC}"
    fi
}

case "${1:-start}" in
    start)
        start_servers
        ;;
    stop)
        stop_servers
        ;;
    restart)
        stop_servers
        sleep 1
        start_servers
        ;;
    status)
        show_status
        ;;
    *)
        echo "Usage: ./dev.sh [start|stop|restart|status]"
        exit 1
        ;;
esac
