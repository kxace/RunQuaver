from channels import Group
from channels.sessions import channel_session
import json

@channel_session
def ws_connect(message):
    Group('users').add(message.reply_channel)
    message.channel_session['globe'] = "globe"
    message.reply_channel.send({'accept': True})

@channel_session
def ws_receive(message):
    label = message.channel_session['globe']
    data = json.loads(message['text'])
    m = {
        'user' :  data['user'],
        'x' : data['x'],
        'y' : data['y']
    }
    Group('users').send({'text': json.dumps(m)})

@channel_session
def ws_disconnect(message):
    label = message.channel_session['globe']
    Group('users').discard(message.reply_channel)