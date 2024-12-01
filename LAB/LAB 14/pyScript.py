from js import document
import pyodide

class Calculator:
    def __init__(self, element_id):
        self.element = document.getElementById(element_id)
        self.setup_event_listeners()

    def setup_event_listeners(self):
        self.persistent_handler = pyodide.create_proxy(self.handle_keypress)
        document.addEventListener("keypress", self.persistent_handler)

    def handle_keypress(self, event):
        value = event.key

        if value in ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '-', '/', '*']:
            self.element.innerHTML += value
        elif value == '<':
            self.element.innerHTML = self.element.innerText[:-1]
        elif value.upper() == 'C':
            self.element.innerHTML = "0"
        elif value == '=':
            try:
                self.element.innerHTML = str(eval(self.element.innerHTML))
            except Exception:
                self.element.innerHTML = "Error"

calc = Calculator("result")
