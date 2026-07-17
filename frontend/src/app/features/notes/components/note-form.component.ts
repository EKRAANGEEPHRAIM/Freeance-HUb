import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import type { Note, NotePayload } from '../../../shared/models/note.models';

@Component({
  selector: 'app-note-form',
  imports: [ReactiveFormsModule],
  template: `
    <form class="space-y-5" [formGroup]="form" (ngSubmit)="submit()">
      <label class="block"><span class="mb-2 block text-sm font-semibold text-slate-700">Titre</span><input class="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" [class.border-rose-400]="hasError('title')" [class.border-slate-200]="!hasError('title')" formControlName="title" placeholder="Préparer le rendez-vous client" />@if (hasError('title')) { <span class="mt-1 block text-xs text-rose-600">Le titre est requis.</span> }</label>
      <label class="block"><span class="mb-2 block text-sm font-semibold text-slate-700">Contenu</span><textarea class="min-h-48 w-full resize-y rounded-xl border px-4 py-3 leading-6 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" [class.border-rose-400]="hasError('content')" [class.border-slate-200]="!hasError('content')" formControlName="content" placeholder="Écris ta note ici..."></textarea>@if (hasError('content')) { <span class="mt-1 block text-xs text-rose-600">Le contenu est requis.</span> }</label>
      <div class="flex justify-end gap-3 border-t border-slate-100 pt-5"><button class="rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-100" type="button" (click)="cancelled.emit()">Annuler</button><button class="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 disabled:opacity-60" type="submit" [disabled]="saving">@if (saving) { Enregistrement... } @else { {{ note ? 'Enregistrer' : 'Créer la note' }} }</button></div>
    </form>
  `,
})
export class NoteFormComponent {
  private readonly formBuilder = inject(FormBuilder);
  private _note: Note | null = null;
  @Input() saving = false;
  @Output() readonly cancelled = new EventEmitter<void>();
  @Output() readonly submitted = new EventEmitter<NotePayload>();
  @Input() set note(value: Note | null) { this._note = value; this.form.reset({ title: value?.title ?? '', content: value?.content ?? '' }); }
  get note(): Note | null { return this._note; }
  protected readonly form = this.formBuilder.nonNullable.group({ title: ['', [Validators.required, Validators.maxLength(255)]], content: ['', [Validators.required, Validators.maxLength(10000)]] });
  protected hasError(control: 'title' | 'content'): boolean { const field = this.form.controls[control]; return field.invalid && (field.touched || field.dirty); }
  protected submit(): void { if (this.form.invalid) { this.form.markAllAsTouched(); return; } const value = this.form.getRawValue(); this.submitted.emit({ title: value.title.trim(), content: value.content.trim() }); }
}
