"""Answer one question from the Cognee dataset `vouch`.

    python cognee/ask.py "Who could give a talk on AI agents?"
"""

import asyncio
import sys

from common import flatten_search, load_env, search


async def ask(question):
    return flatten_search(search(question))


def main():
    question = " ".join(sys.argv[1:]).strip() or sys.stdin.read().strip()
    if not question:
        print("question is required", file=sys.stderr)
        sys.exit(2)
    load_env()
    try:
        answer = asyncio.run(ask(question))
    except Exception as error:
        print(str(error), file=sys.stderr)
        sys.exit(1)
    if not answer:
        print("No answer yet. Run python cognee/sync.py after members have joined.", file=sys.stderr)
        sys.exit(1)
    print(answer)


if __name__ == "__main__":
    main()
