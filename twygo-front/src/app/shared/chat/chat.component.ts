import { Component, ElementRef, ViewChild, AfterViewInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../core/services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ChatComponent implements AfterViewInit, OnChanges {
  @ViewChild('messageContainer') messageContainer!: ElementRef;

  isMinimized = false;
  isLoading = false;
  userMessage = '';
  messages: { text: string; isUser: boolean }[] = [];
  @Input() courseId?: string;
  @Input() lessonId?: string;

  constructor(private chatService: ChatService) {}

  ngAfterViewInit() {
    this.scrollToBottom();
    console.log('Chat iniciado para curso:', this.courseId, 'ou lição:', this.lessonId);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['lessonId'] && !changes['lessonId'].firstChange) {
      console.log('Mudança detectada em lessonId:', this.lessonId);
      this.resetChat();
    }
  }

  toggleChat() {
    this.isMinimized = !this.isMinimized;
  }

  sendMessage() {
    if (!this.userMessage.trim() || this.isLoading) return;

    this.messages.push({ text: this.userMessage, isUser: true });
    const prompt = this.userMessage;
    this.userMessage = '';
    this.isLoading = true;
    this.scrollToBottom();

    this.chatService.sendMessage(prompt, this.courseId, this.lessonId).subscribe({
      next: (response) => {
        this.messages.push({ text: response.response, isUser: false });
        this.isLoading = false;
        this.scrollToBottom();
      },
      error: (error) => {
        console.error('Erro ao chamar o chatbot:', error);
        this.messages.push({ text: 'Desculpe, ocorreu um erro. Tente novamente.', isUser: false });
        this.isLoading = false;
        this.scrollToBottom();
      }
    });
  }

  private resetChat() {
    console.log('Resetando chat para a nova aula:', this.lessonId);
    this.messages = [];
    this.userMessage = '';
  }

  private scrollToBottom() {
    setTimeout(() => {
      if (this.messageContainer) {
        const container = this.messageContainer.nativeElement;
        container.scrollTop = container.scrollHeight;
      }
    }, 0);
  }
}
