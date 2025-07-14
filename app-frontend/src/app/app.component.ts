import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ChatService } from '../../ChatService';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [CommonModule, FormsModule],
})
export class AppComponent implements OnInit, OnDestroy {  
  chatService = inject(ChatService);
  user: string = '';
  message: string = '';
  messages: {user: string, msg: string}[] = [];
  typingNotification: string | null = null;

  ngOnInit() {
    this.chatService.startConnection();
    this.chatService.messageRecieved$.subscribe((message) => {
      if (message) {
        this.messages.push(message);
      }
    });
    
    this.chatService.typingNotification$.subscribe((notification) => {
      this.typingNotification = notification;
    });
  }

  sendMessage(): void {
    this.chatService.sendMessage(this.user, this.message);
    this.message = '';
  }

  onTyping(): void {
    this.chatService.sendTypingNotification(this.user);
  }
  
  ngOnDestroy(): void {
    this.chatService.stopConnection();
  }
}
