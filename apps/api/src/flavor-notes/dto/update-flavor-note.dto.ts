import { PartialType } from '@nestjs/swagger';
import { CreateFlavorNoteDto } from './create-flavor-note.dto.js';

export class UpdateFlavorNoteDto extends PartialType(CreateFlavorNoteDto) {}
