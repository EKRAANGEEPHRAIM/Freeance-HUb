import {
  Component,
  computed,
  inject,
  OnInit,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { NoteFormComponent } from './components/note-form.component';
import { NotesService } from './services/notes.service';
import type { Note, NotePayload } from '../../shared/models/note.models';

@Component({
  selector: 'app-notes',
  imports: [DatePipe, NoteFormComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <section class="space-y-7">
      <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p class="text-sm font-semibold text-indigo-600">Organisation</p>
          <h2 class="mt-1 text-3xl font-bold tracking-tight text-slate-950">Notes</h2>
          <p class="mt-2 text-slate-500">
            Capture tes idées et garde tes informations importantes à portée de main.
          </p>
        </div>
        <button
          class="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700"
          type="button"
          (click)="openCreate()"
        >
          <svg
            class="size-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M12 5v14M5 12h14" /></svg
          >Nouvelle note
        </button>
      </div>
      @if (errorMessage()) {
        <div
          class="flex items-center justify-between gap-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
        >
          <span>{{ errorMessage() }}</span
          ><button class="font-semibold" type="button" (click)="loadNotes()">Réessayer</button>
        </div>
      }
      <div class="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div class="border-b border-slate-100 p-5">
          <div class="relative max-w-md">
            <svg
              class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" /></svg
            ><input
              class="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              type="search"
              placeholder="Rechercher une note..."
              [value]="query()"
              (input)="query.set($any($event.target).value)"
            />
          </div>
        </div>
        @if (loading()) {
          <div class="grid gap-5 p-5 md:grid-cols-2 xl:grid-cols-3">
            @for (item of [1, 2, 3]; track item) {
              <div class="h-48 animate-pulse rounded-2xl bg-slate-100"></div>
            }
          </div>
        } @else if (filteredNotes().length) {
          <div class="grid gap-5 p-5 md:grid-cols-2 xl:grid-cols-3">
            @for (note of filteredNotes(); track note.id) {
              <article
                class="group flex min-h-56 flex-col rounded-2xl border border-slate-200 p-5 transition hover:border-violet-200 hover:shadow-lg hover:shadow-indigo-950/5"
              >
                <div class="flex items-start justify-between gap-3">
                  <span
                    class="grid size-9 place-items-center rounded-xl bg-violet-100 text-violet-700"
                    ><svg
                      class="size-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
                      <path d="M14 2v6h6M8 13h8M8 17h6" /></svg
                  ></span>
                  <div
                    class="flex gap-1 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100"
                  >
                    <button
                      class="grid size-8 place-items-center rounded-lg text-slate-500 hover:bg-indigo-50 hover:text-indigo-700"
                      type="button"
                      aria-label="Modifier"
                      (click)="openEdit(note)"
                    >
                      <svg
                        class="size-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                      </svg></button
                    ><button
                      class="grid size-8 place-items-center rounded-lg text-slate-500 hover:bg-rose-50 hover:text-rose-700"
                      type="button"
                      aria-label="Supprimer"
                      (click)="noteToDelete.set(note)"
                    >
                      <svg
                        class="size-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path d="M4 7h16M10 11v6M14 11v6M9 7V4h6v3M6 7l1 14h10l1-14" />
                      </svg>
                    </button>
                  </div>
                </div>
                <h3 class="mt-5 text-lg font-bold text-slate-950">{{ note.title }}</h3>
                <p
                  class="mt-3 line-clamp-4 flex-1 whitespace-pre-line text-sm leading-6 text-slate-600"
                >
                  {{ note.content }}
                </p>
                <p class="mt-5 border-t border-slate-100 pt-4 text-xs font-medium text-slate-400">
                  Modifiée le {{ note.updatedAt | date: 'd MMM y à HH:mm' }}
                </p>
              </article>
            }
          </div>
        } @else {
          <div class="grid min-h-80 place-items-center p-8 text-center">
            <div>
              <span
                class="grid mx-auto size-14 place-items-center rounded-2xl bg-violet-100 text-2xl text-violet-700"
                >✦</span
              >
              <h3 class="mt-5 text-lg font-bold text-slate-950">
                {{ query() ? 'Aucun résultat' : 'Aucune note pour l’instant' }}
              </h3>
              <p class="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                {{
                  query()
                    ? 'Essaie une autre recherche.'
                    : 'Crée une note pour conserver tes idées et informations importantes.'
                }}
              </p>
              @if (!query()) {
                <button
                  class="mt-5 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white"
                  type="button"
                  (click)="openCreate()"
                >
                  Créer une note
                </button>
              }
            </div>
          </div>
        }
      </div>
    </section>
    @if (formOpen()) {
      <div class="fixed inset-0 z-50 grid place-items-center overflow-y-auto p-4">
        <button
          class="fixed inset-0 bg-slate-950/40 backdrop-blur-sm"
          type="button"
          aria-label="Fermer"
          (click)="closeForm()"
        ></button>
        <div class="relative my-8 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl sm:p-7">
          <div class="mb-6 flex items-start justify-between gap-4">
            <div>
              <p class="text-sm font-semibold text-indigo-600">
                {{ selectedNote() ? 'Modifier la note' : 'Nouvelle note' }}
              </p>
              <h3 class="mt-1 text-2xl font-bold text-slate-950">
                {{ selectedNote() ? selectedNote()?.title : 'Créer une note' }}
              </h3>
            </div>
            <button
              class="grid size-9 place-items-center rounded-lg text-slate-500 hover:bg-slate-100"
              type="button"
              aria-label="Fermer"
              (click)="closeForm()"
            >
              <svg
                class="size-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="m6 6 12 12M18 6 6 18" />
              </svg>
            </button>
          </div>
          <app-note-form
            [note]="selectedNote()"
            [saving]="saving()"
            (cancelled)="closeForm()"
            (submitted)="saveNote($event)"
          />
        </div>
      </div>
    }
    @if (noteToDelete(); as note) {
      <div class="fixed inset-0 z-50 grid place-items-center p-4">
        <button
          class="absolute inset-0 bg-slate-950/40"
          type="button"
          aria-label="Annuler"
          (click)="noteToDelete.set(null)"
        ></button>
        <div class="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
          <span class="grid size-11 place-items-center rounded-xl bg-rose-100 text-rose-700"
            >!</span
          >
          <h3 class="mt-5 text-xl font-bold text-slate-950">Supprimer {{ note.title }} ?</h3>
          <p class="mt-2 text-sm leading-6 text-slate-500">
            Cette action est définitive et ne pourra pas être annulée.
          </p>
          <div class="mt-6 flex justify-end gap-3">
            <button
              class="rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-100"
              type="button"
              (click)="noteToDelete.set(null)"
            >
              Annuler</button
            ><button
              class="rounded-xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-60"
              type="button"
              [disabled]="saving()"
              (click)="deleteNote(note)"
            >
              @if (saving()) {
                Suppression...
              } @else {
                Supprimer
              }
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class NotesComponent implements OnInit {
  private readonly notesService = inject(NotesService);
  protected readonly notes = signal<Note[]>([]);
  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly errorMessage = signal('');
  protected readonly query = signal('');
  protected readonly formOpen = signal(false);
  protected readonly selectedNote = signal<Note | null>(null);
  protected readonly noteToDelete = signal<Note | null>(null);
  protected readonly filteredNotes = computed(() => {
    const term = this.query().trim().toLocaleLowerCase();
    return !term
      ? this.notes()
      : this.notes().filter((note) =>
          `${note.title} ${note.content}`.toLocaleLowerCase().includes(term),
        );
  });
  ngOnInit(): void {
    this.loadNotes();
  }
  protected loadNotes(): void {
    this.loading.set(true);
    this.errorMessage.set('');
    this.notesService.findAll().subscribe({
      next: (notes) => {
        this.notes.set(notes);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set(
          'Impossible de charger tes notes. Vérifie ta connexion puis réessaie.',
        );
        this.loading.set(false);
      },
    });
  }
  protected openCreate(): void {
    this.selectedNote.set(null);
    this.formOpen.set(true);
  }
  protected openEdit(note: Note): void {
    this.selectedNote.set(note);
    this.formOpen.set(true);
  }
  protected closeForm(): void {
    if (!this.saving()) this.formOpen.set(false);
  }
  protected saveNote(payload: NotePayload): void {
    const selected = this.selectedNote();
    const request = selected
      ? this.notesService.update(selected.id, payload)
      : this.notesService.create(payload);
    this.saving.set(true);
    request.subscribe({
      next: (note) => {
        this.notes.update((notes) =>
          selected
            ? notes.map((current) => (current.id === note.id ? note : current))
            : [note, ...notes],
        );
        this.saving.set(false);
        this.formOpen.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage.set(this.getError(error, 'Impossible d’enregistrer cette note.'));
        this.saving.set(false);
      },
    });
  }
  protected deleteNote(note: Note): void {
    this.saving.set(true);
    this.notesService.remove(note.id).subscribe({
      next: () => {
        this.notes.update((notes) => notes.filter((current) => current.id !== note.id));
        this.noteToDelete.set(null);
        this.saving.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage.set(this.getError(error, 'Impossible de supprimer cette note.'));
        this.saving.set(false);
      },
    });
  }
  private getError(error: HttpErrorResponse, fallback: string): string {
    return typeof error.error?.message === 'string' ? error.error.message : fallback;
  }
}
