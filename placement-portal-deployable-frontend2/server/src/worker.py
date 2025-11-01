import asyncio
import json
import pusherclient
from src.config import secrets
from src.services.utils import send_email_to_student


def on_connect(data):
    """
    Callback executed when the Pusher client successfully connects.
    Subscribes to the 'email-channel' and binds the event handler.
    """
    print("[Worker] Connected to Pusher")

    channel = pusher_client.subscribe("email-channel")

    def email_handler(event_data):
        """
        Handles incoming 'send-email-to-student' events.
        Parses payload and sends email asynchronously.
        """
        try:
            # Parse the JSON payload sent by Pusher
            payload = json.loads(event_data)

            asyncio.run(
                send_email_to_student(
                    payload["email"],
                    payload["subject"],
                    payload["body"],
                )
            )
        except Exception as exc:
            print(f"[Worker] Error processing event: {exc}")

    channel.bind("send-email-to-student", email_handler)
    print("[Worker] Bound to send-email-to-student")


# --- Patch host manually for older Pusher versions ---
pusherclient.Pusher.host = "ws-ap2.pusher.com"


# Initialize Pusher client
pusher_client = pusherclient.Pusher(key=secrets.PUSHER_KEY)
pusher_client.connection.bind("pusher:connection_established", on_connect)
pusher_client.connect()


# Run event loop indefinitely
try:
    asyncio.get_event_loop().run_forever()
except KeyboardInterrupt:
    print("[Worker] Stopped manually")
