import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { FileUpload } from 'primeng/fileupload';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToolbarModule } from 'primeng/toolbar';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

import { OcrService } from './services/ocr.service';
import { ResultadoItem } from './model/resultadoItem';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    ToastModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    FileUploadModule,
    ButtonModule,
    InputTextModule,
    CardModule,
    ProgressSpinnerModule,
    ToolbarModule,
  ],
  providers: [MessageService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  loading = false;
  results: ResultadoItem[] = [];

  constructor(private ocr: OcrService, private msg: MessageService) {}

  onSelect(event: any, uploader: FileUpload) {
    const files: File[] = Array.from(event.files);

    if (!files || files.length === 0) {
      this.msg.add({
        severity: 'warn',
        summary: 'Erro',
        detail: 'Nenhum arquivo recebido',
      });
      return;
    }

    if (files.length > 5) {
      this.msg.add({
        severity: 'warn',
        summary: 'Limite',
        detail: 'Máximo 5 imagens',
      });
      return;
    }

    this.loading = true;

    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));

    this.ocr.processarFormData(formData).subscribe({
      next: (res) => {
        this.loading = false;

        this.results = res.map((r, idx) => ({
          texto: r.status === 'SUCCESS' ? r.readValue || '' : r.message,
          editando: false,
          erro: r.status !== 'SUCCESS',
          arquivo: files[idx]?.name,
        }));

        uploader.clear();

        this.msg.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Processado!',
        });
      },
      error: (err) => {
        this.loading = false;
        uploader.clear();
        console.error('Erro no backend:', err);
        this.msg.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível extrair a Licença',
        });
      },
    });
  }

  copy(i: number) {
    navigator.clipboard.writeText(this.results[i].texto);
    this.msg.add({
      severity: 'info',
      summary: 'Copiado!',
      detail: 'Texto copiado',
    });
  }

  editarOuConfirmar(i: number) {
    this.results[i].editando = !this.results[i].editando;
  }
}
