using Microsoft.AspNetCore.SignalR;

namespace app_backend
{
    public class ChatHub : Hub
    {
        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }

        public override Task OnConnectedAsync()
        {
            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception? exception)
        {
            return base.OnDisconnectedAsync(exception);
        }

        public async Task UserTyping(string user)
        {
            await Clients.Others.SendAsync("UserTyping", user);
        }
    }
}
