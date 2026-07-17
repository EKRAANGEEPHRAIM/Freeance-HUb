import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { API_URL } from '../../../core/services/api-url.token';
import { ClientsService } from './clients.service';

const client = {
  id: 'a29a1e19-6f39-4fd1-adf9-dbf561f8eb00',
  name: 'Acme Corp',
  email: 'contact@acme.test',
  phone: null,
  company: null,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

describe('ClientsService', () => {
  let service: ClientsService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_URL, useValue: 'http://api.test/api' },
      ],
    });
    service = TestBed.inject(ClientsService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpController.verify());

  it('sends the expected CRUD requests', () => {
    service.findAll().subscribe();
    service.create({ name: client.name, email: client.email, phone: null, company: null }).subscribe();
    service.update(client.id, { name: 'Renamed Corp', email: client.email, phone: null, company: null }).subscribe();
    service.remove(client.id).subscribe();

    const requests = httpController.match('http://api.test/api/clients');
    expect(requests.map((request) => request.request.method)).toEqual(['GET', 'POST']);
    requests[0].flush([client]);
    requests[1].flush(client);

    const updateRequest = httpController.expectOne(`http://api.test/api/clients/${client.id}`);
    expect(updateRequest.request.method).toBe('PATCH');
    updateRequest.flush({ ...client, name: 'Renamed Corp' });

    const deleteRequest = httpController.expectOne(`http://api.test/api/clients/${client.id}`);
    expect(deleteRequest.request.method).toBe('DELETE');
    deleteRequest.flush(client);
  });
});
