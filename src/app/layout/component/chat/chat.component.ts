import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PanelModule } from 'primeng/panel';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-chat',
  imports: [FormsModule, CommonModule,PanelModule,InputTextModule,MessageModule,ButtonModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  standalone:true
})
export class ChatComponent {
  userMessage: string = '';
  chatResponse: string = '';
  loading: boolean = false;
  error: string = '';

  constructor(private http: HttpClient) { }

  sendMessage() {
    if (!this.userMessage.trim()) {
      return;
    }

    this.loading = true;
    this.error = '';
    this.chatResponse = '';

    this.http.post('http://localhost:8080/api/chat',
      { message: this.userMessage },
      { responseType: 'text' as 'text' })  
      .subscribe({
        next: (response) => {
          this.chatResponse = response;
          this.loading = false;
        },
        error: (err) => {
          console.error('Chat API error:', err);
          this.error = 'Error contacting chat API';
          this.loading = false;
        }
      });

  }
}
