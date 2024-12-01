import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class ClientDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    example: '1',
    description: 'Unique identifier of the client.',
  })
  readonly id?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'John Doe',
    description: 'Name of the client.',
  })
  readonly name?: string;

  @IsOptional()
  @IsString()
  @Length(11, 11, { message: 'CPF must be exactly 11 characters long.' })
  @ApiProperty({
    example: '12345678901',
    description: 'CPF of the client. Must be 11 characters long.',
  })
  readonly cpf?: string;

  @IsOptional()
  @IsEmail()
  @ApiProperty({
    example: 'client@example.com',
    description: 'Email address of the client.',
  })
  readonly email?: string;

  // Validation logic similar to `isValid` in Client entity
  public isValid(): boolean {
    return !!(this.cpf || (this.email && this.name));
  }
}

export const toDomain = (dto: ClientDto): Record<string, any> => {
  return {
    id: dto.id,
    name: dto.name,
    email: dto.email,
    cpf: dto.cpf,
  };
};
