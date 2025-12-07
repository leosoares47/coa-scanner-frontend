import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ScanResponse } from '../model/scan-response';

@Injectable({ providedIn: 'root' })
export class OcrService {

  private api = 'http://localhost:8080/scanBatch';

  constructor(private http: HttpClient) {}

  processarImagens(files: FileList): Observable<ScanResponse[]> {
    const data = new FormData();

    Array.from(files).forEach(f => data.append('files', f));

    return this.http.post<ScanResponse[]>(this.api, data);
  }


  processarFormData(formData: FormData) {
    return this.http.post<ScanResponse[]>(this.api, formData);
  }

}
