import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import * as signalR from "@microsoft/signalr";

@Injectable({
  providedIn: "root",
})
export class ChatService {
    private hubConnection!: signalR.HubConnection;
    private messageRecieved = new BehaviorSubject<{user: string, msg:string} | null>(null);
    messageRecieved$ = this.messageRecieved.asObservable();
    private typingNotification = new BehaviorSubject<string | null>(null);
    typingNotification$ = this.typingNotification.asObservable();

    startConnection(): void {
        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl("https://localhost:7263/ChatHub")
            .withAutomaticReconnect()
            .build();

        this.hubConnection.start().catch(err => console.error("Error while starting connection: ", err));

        this.hubConnection.on("ReceiveMessage", (user:string, message: string) => {
            this.messageRecieved.next({user: user, msg: message});
        })

        this.hubConnection.on("UserTyping", (user: string) => {
            this.typingNotification.next(`${user} is typing...`);
            setTimeout(() => {
                this.typingNotification.next(null);
            }, 2000);
        });
    }

    sendMessage(user: string, message: string): void {
        this.hubConnection.invoke('SendMessage', user, message).catch(err => console.error(err));
    }

    sendTypingNotification(user: string): void {
        this.hubConnection.invoke('UserTyping', user).catch(err => console.error(err));
    }

    stopConnection(): void {
        this.hubConnection.stop().catch(err => console.error("Error while stopping connection: ", err))  ;
    }
}

