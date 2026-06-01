#!/usr/bin/env python3
"""execvp argv[1:] after resetting INT/TERM/QUIT to SIG_DFL.

Non-interactive background bash jobs ignore SIGINT/SIGQUIT, and that disposition
can survive exec — so `ros2 bag record` never sees Ctrl-C–style shutdown.
This wrapper runs as the bag PID so sim_stop can SIGINT for a clean metadata flush.
"""
import os
import signal
import sys


def main() -> None:
    if len(sys.argv) < 2:
        print("usage: exec_default_signals.py <program> [arg ...]", file=sys.stderr)
        sys.exit(2)
    for sig in (signal.SIGINT, signal.SIGTERM, signal.SIGQUIT):
        signal.signal(sig, signal.SIG_DFL)
    os.execvp(sys.argv[1], sys.argv[1:])


if __name__ == "__main__":
    main()
