import frida, sys

jscodeFile = open("nohttpinterceptor.js", "r")
jscode = jscodeFile.read()
jscodeFile.close()

def on_message(message, data):
    if message['type'] == 'send':
        print(message['payload'])
    else:
        print(message)

device = frida.get_usb_device()
process = device.attach("McDonald's")
script = process.create_script(jscode)
script.on('message', on_message)

print('[+] Running')
script.load()
sys.stdin.read()
