Handover Session  Data Logic written based on the app code (HandoverProducts and HandoverMapping)

Created

Carton–task mapping:
A new mapping is created every time a carton is scanned on the mapping screen. The app calls handoverMap with the carton code and the task ID, which links that carton to the task. By default, each scan counts the whole carton. You only get the quantity prompt (qtyL0) after turning the switch on.

Modified

Handover task:
The handoverMap call updates the task. The scanned carton is added to the task's carton list, and its progress goes up. Progress is tracked as cases done vs target (doneL2 & targetL2) and pieces done vs target (doneL0 & targetL0). The server does this update, and the app just shows the updated task it gets back.

Only read
Task list- The products screen loads all tasks when it opens, and loads them again each time you come back from a task.

SKU and batch- Product code, name, type and batch are only shown on screen.

Cartons- Cartons already exist before the handover. They get linked to a task, but the carton itself isn't changed.

Handover completion- When all tasks are done, a "Handover completed" popup appears. The app decides this by checking the task list, and nothing is saved for it.


Recently scanned cartons. For each task, the phone saves the scanned carton codes so it can highlight them on screen. This is not sent to the server.