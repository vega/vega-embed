"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Open editor url in a new window, and pass a message.
 */
function post(window, url, data) {
    var editor = window.open(url);
    var wait = 10000;
    var step = 250;
    var count = ~~(wait / step);
    function listen(evt) {
        if (evt.source === editor) {
            count = 0;
            window.removeEventListener('message', listen, false);
        }
    }
    window.addEventListener('message', listen, false);
    // send message
    // periodically resend until ack received or timeout
    function send() {
        if (count <= 0) {
            return;
        }
        editor.postMessage(data, '*');
        setTimeout(send, step);
        count -= 1;
    }
    setTimeout(send, step);
}
exports.post = post;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9zdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9wb3N0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUE7O0dBRUc7QUFDSCxjQUFxQixNQUFjLEVBQUUsR0FBVyxFQUFFLElBQW9EO0lBQ3BHLElBQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDaEMsSUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDO0lBQ25CLElBQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQztJQUNqQixJQUFJLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUM7SUFFNUIsZ0JBQWdCLEdBQUc7UUFDakIsSUFBSSxHQUFHLENBQUMsTUFBTSxLQUFLLE1BQU0sRUFBRTtZQUN6QixLQUFLLEdBQUcsQ0FBQyxDQUFDO1lBQ1YsTUFBTSxDQUFDLG1CQUFtQixDQUFDLFNBQVMsRUFBRSxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDdEQ7SUFDSCxDQUFDO0lBQ0QsTUFBTSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFFbEQsZUFBZTtJQUNmLG9EQUFvRDtJQUNwRDtRQUNFLElBQUksS0FBSyxJQUFJLENBQUMsRUFBRTtZQUNkLE9BQU87U0FDUjtRQUNELE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQzlCLFVBQVUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDdkIsS0FBSyxJQUFJLENBQUMsQ0FBQztJQUNiLENBQUM7SUFDRCxVQUFVLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3pCLENBQUM7QUF6QkQsb0JBeUJDIn0=