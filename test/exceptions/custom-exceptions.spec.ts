import { BadRequestException } from '@/core/exceptions/custom-exceptions/bad-request.exception';
import { InternalServerErrorException } from '@/core/exceptions/custom-exceptions/internal-server-error.exception';
import { NotFoundException } from '@/core/exceptions/custom-exceptions/not-found.exception';

describe('Custom Exceptions', () => {
  describe('BadRequestException', () => {
    it('should create a BadRequestException with correct properties', () => {
      const exception = new BadRequestException({
        description: 'Bad Request',
      });

      expect(exception).toBeInstanceOf(Error);
      expect(exception.name).toBe('BadRequestException');
      expect(exception.getMessage()).toBe('Bad Request');
      expect(exception.getStatusCode()).toBe(400);
    });
  });

  describe('InternalServerErrorException', () => {
    it('should create an InternalServerErrorException with correct properties', () => {
      const exception = new InternalServerErrorException({
        description: 'Internal Error',
        details: 'Database connection failed',
      });

      expect(exception).toBeInstanceOf(Error);
      expect(exception.name).toBe('InternalServerErrorException');
      expect(exception.getMessage()).toBe('Internal Error');
      expect(exception.getDetails()).toBe('Database connection failed');
      expect(exception.getStatusCode()).toBe(500);
    });

    it('should handle undefined details', () => {
      const exception = new InternalServerErrorException({
        description: 'Internal Error',
      });

      expect(exception.getDetails()).toBeUndefined();
    });
  });

  describe('NotFoundException', () => {
    it('should create a NotFoundException with correct properties', () => {
      const exception = new NotFoundException({
        description: 'Not Found',
      });

      expect(exception).toBeInstanceOf(Error);
      expect(exception.name).toBe('NotFoundException');
      expect(exception.getMessage()).toBe('Not Found');
      expect(exception.getStatusCode()).toBe(404);
    });
  });
});
