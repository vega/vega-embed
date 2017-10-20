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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9zdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9wb3N0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7O0dBRUc7QUFDSCxjQUFxQixNQUFjLEVBQUUsR0FBVyxFQUFFLElBQVM7SUFDekQsSUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNoQyxJQUFNLElBQUksR0FBRyxLQUFLLENBQUM7SUFDbkIsSUFBTSxJQUFJLEdBQUcsR0FBRyxDQUFDO0lBQ2pCLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQztJQUU1QixnQkFBZ0IsR0FBRztRQUNqQixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDMUIsS0FBSyxHQUFHLENBQUMsQ0FBQztZQUNWLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLEVBQUUsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3ZELENBQUM7SUFDSCxDQUFDO0lBQ0QsTUFBTSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFFbEQsZUFBZTtJQUNmLG9EQUFvRDtJQUNwRDtRQUNFLEVBQUUsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2YsTUFBTSxDQUFDO1FBQ1QsQ0FBQztRQUNELE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQzlCLFVBQVUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDdkIsS0FBSyxJQUFJLENBQUMsQ0FBQztJQUNiLENBQUM7SUFDRCxVQUFVLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3pCLENBQUM7QUF6QkQsb0JBeUJDIn0=