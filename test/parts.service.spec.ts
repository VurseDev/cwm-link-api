import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { PartsService } from '../src/parts/parts.service';
import { PrismaService } from '../src/prisma/prisma.service';
import { CreatePartDto } from '../src/parts/dto/create-part.dto';
import { UpdatePartDto } from '../src/parts/dto/update-part.dto';
import { Prisma } from '../generated/prisma/client';

describe('PartsService', () => {
  let service: PartsService;
  let prisma: PrismaService;

  // Mock data
  const mockPart = {
    id: 1,
    serialId: 'TEST-001',
    partName: 'Test Part',
    partDescription: 'A test part',
    status: 'pending',
    createdAt: new Date('2026-05-10T15:00:00.000Z'),
    logs: [
      {
        id: 1,
        step: 'created',
        operator: 'TestOperator',
        timestamp: new Date('2026-05-10T15:00:00.000Z'),
        partId: 1,
      },
    ],
  };

  const mockLog = {
    id: 2,
    step: 'inspection',
    operator: 'QAOperator',
    timestamp: new Date('2026-05-10T16:00:00.000Z'),
    partId: 1,
  };

  const mockPrismaService = {
    part: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    log: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PartsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<PartsService>(PartsService);
    prisma = module.get<PrismaService>(PrismaService);

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createPartDto: CreatePartDto = {
      serialId: 'TEST-001',
      operator: 'TestOperator',
      partName: 'Test Part',
      partDescription: 'A test part',
      status: 'pending',
    };

    it('should successfully create a part with an initial log', async () => {
      mockPrismaService.part.create.mockResolvedValue(mockPart);

      const result = await service.create(createPartDto);

      expect(prisma.part.create).toHaveBeenCalledWith({
        data: {
          serialId: createPartDto.serialId,
          partName: createPartDto.partName,
          partDescription: createPartDto.partDescription,
          status: createPartDto.status,
          logs: {
            create: {
              step: 'created',
              operator: createPartDto.operator,
            },
          },
        },
        include: { logs: true },
      });
      expect(result).toEqual(mockPart);
      expect(result.logs).toHaveLength(1);
      expect(result.logs[0].step).toBe('created');
    });

    it('should throw error when creating part with duplicate serialId', async () => {
      const prismaError = new Prisma.PrismaClientKnownRequestError(
        'Unique constraint failed on the fields: (`serialId`)',
        {
          code: 'P2002',
          clientVersion: '7.8.0',
          meta: { target: ['serialId'] },
        },
      );
      mockPrismaService.part.create.mockRejectedValue(prismaError);

      await expect(service.create(createPartDto)).rejects.toThrow(
        Prisma.PrismaClientKnownRequestError,
      );
      expect(prisma.part.create).toHaveBeenCalled();
    });

    it('should automatically set created log with correct operator', async () => {
      mockPrismaService.part.create.mockResolvedValue(mockPart);

      await service.create(createPartDto);

      const createCall = mockPrismaService.part.create.mock.calls[0][0];
      expect(createCall.data.logs.create.step).toBe('created');
      expect(createCall.data.logs.create.operator).toBe(createPartDto.operator);
    });

    it('should include logs in the response', async () => {
      mockPrismaService.part.create.mockResolvedValue(mockPart);

      await service.create(createPartDto);

      const createCall = mockPrismaService.part.create.mock.calls[0][0];
      expect(createCall.include).toEqual({ logs: true });
    });

    it('should handle database connection errors', async () => {
      const dbError = new Error('Database connection failed');
      mockPrismaService.part.create.mockRejectedValue(dbError);

      await expect(service.create(createPartDto)).rejects.toThrow(
        'Database connection failed',
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of all parts with logs', async () => {
      const mockParts = [mockPart];
      mockPrismaService.part.findMany.mockResolvedValue(mockParts);

      const result = await service.findAll();

      expect(prisma.part.findMany).toHaveBeenCalledWith({
        include: { logs: true },
      });
      expect(result).toEqual(mockParts);
      expect(result).toHaveLength(1);
      expect(result[0].logs).toBeDefined();
    });

    it('should return empty array when no parts exist', async () => {
      mockPrismaService.part.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should include all logs for each part', async () => {
      const partWithMultipleLogs = {
        ...mockPart,
        logs: [
          mockPart.logs[0],
          {
            id: 2,
            step: 'inspection',
            operator: 'QAOperator',
            timestamp: new Date(),
            partId: 1,
          },
          {
            id: 3,
            step: 'assembly',
            operator: 'AssemblyOperator',
            timestamp: new Date(),
            partId: 1,
          },
        ],
      };
      mockPrismaService.part.findMany.mockResolvedValue([partWithMultipleLogs]);

      const result = await service.findAll();

      expect(result[0].logs).toHaveLength(3);
    });

    it('should handle database errors', async () => {
      const dbError = new Error('Failed to query database');
      mockPrismaService.part.findMany.mockRejectedValue(dbError);

      await expect(service.findAll()).rejects.toThrow('Failed to query database');
    });
  });

  describe('findOne', () => {
    it('should return a part by serialId', async () => {
      mockPrismaService.part.findUnique.mockResolvedValue(mockPart);

      const result = await service.findOne('TEST-001');

      expect(prisma.part.findUnique).toHaveBeenCalledWith({
        where: { serialId: 'TEST-001' },
        include: { logs: true },
      });
      expect(result).toEqual(mockPart);
    });

    it('should return null when part is not found', async () => {
      mockPrismaService.part.findUnique.mockResolvedValue(null);

      const result = await service.findOne('nonexistent');

      expect(prisma.part.findUnique).toHaveBeenCalledWith({
        where: { serialId: 'nonexistent' },
        include: { logs: true },
      });
      expect(result).toBeNull();
    });

    it('should include logs in the response', async () => {
      mockPrismaService.part.findUnique.mockResolvedValue(mockPart);

      const result = await service.findOne('TEST-001');

      expect(result.logs).toBeDefined();
      expect(Array.isArray(result.logs)).toBe(true);
    });

    it('should handle database errors', async () => {
      const dbError = new Error('Database query failed');
      mockPrismaService.part.findUnique.mockRejectedValue(dbError);

      await expect(service.findOne('TEST-001')).rejects.toThrow(
        'Database query failed',
      );
    });
  });

  describe('update', () => {
    const updatePartDto: UpdatePartDto = {
      status: 'completed',
      partDescription: 'Updated description',
    };

    it('should successfully update a part', async () => {
      const updatedPart = {
        ...mockPart,
        status: 'completed',
        partDescription: 'Updated description',
      };
      mockPrismaService.part.update.mockResolvedValue(updatedPart);

      const result = await service.update('TEST-001', updatePartDto);

      expect(prisma.part.update).toHaveBeenCalledWith({
        where: { serialId: 'TEST-001' },
        data: {
          partName: updatePartDto.partName,
          partDescription: updatePartDto.partDescription,
          status: updatePartDto.status,
        },
        include: { logs: true },
      });
      expect(result).toEqual(updatedPart);
    });

    it('should throw NotFoundException when part does not exist', async () => {
      const prismaError = new Prisma.PrismaClientKnownRequestError(
        'Record to update not found',
        {
          code: 'P2025',
          clientVersion: '7.8.0',
        },
      );
      mockPrismaService.part.update.mockRejectedValue(prismaError);

      await expect(service.update('nonexistent', updatePartDto)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.update('nonexistent', updatePartDto)).rejects.toThrow(
        'Part with serialId nonexistent not found',
      );
    });

    it('should allow partial updates', async () => {
      const partialUpdate: UpdatePartDto = { status: 'in-progress' };
      const partiallyUpdatedPart = {
        ...mockPart,
        status: 'in-progress',
      };
      mockPrismaService.part.update.mockResolvedValue(partiallyUpdatedPart);

      const result = await service.update('TEST-001', partialUpdate);

      expect(result.status).toBe('in-progress');
      expect(prisma.part.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            status: 'in-progress',
          }),
        }),
      );
    });

    it('should include logs in the updated response', async () => {
      const updatedPart = { ...mockPart, status: 'completed' };
      mockPrismaService.part.update.mockResolvedValue(updatedPart);

      const result = await service.update('TEST-001', { status: 'completed' });

      expect(result.logs).toBeDefined();
      const updateCall = mockPrismaService.part.update.mock.calls[0][0];
      expect(updateCall.include).toEqual({ logs: true });
    });

    it('should propagate other Prisma errors', async () => {
      const prismaError = new Prisma.PrismaClientKnownRequestError(
        'Some other error',
        {
          code: 'P2003',
          clientVersion: '7.8.0',
        },
      );
      mockPrismaService.part.update.mockRejectedValue(prismaError);

      await expect(service.update('TEST-001', updatePartDto)).rejects.toThrow(
        Prisma.PrismaClientKnownRequestError,
      );
    });
  });

  describe('remove', () => {
    it('should successfully delete a part', async () => {
      mockPrismaService.part.delete.mockResolvedValue(mockPart);

      const result = await service.remove('TEST-001');

      expect(prisma.part.delete).toHaveBeenCalledWith({
        where: { serialId: 'TEST-001' },
        include: { logs: true },
      });
      expect(result).toEqual(mockPart);
    });

    it('should throw NotFoundException when part does not exist', async () => {
      const prismaError = new Prisma.PrismaClientKnownRequestError(
        'Record to delete not found',
        {
          code: 'P2025',
          clientVersion: '7.8.0',
        },
      );
      mockPrismaService.part.delete.mockRejectedValue(prismaError);

      await expect(service.remove('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.remove('nonexistent')).rejects.toThrow(
        'Part with serialId nonexistent not found',
      );
    });

    it('should return deleted part with its logs', async () => {
      mockPrismaService.part.delete.mockResolvedValue(mockPart);

      const result = await service.remove('TEST-001');

      expect(result.logs).toBeDefined();
      expect(Array.isArray(result.logs)).toBe(true);
    });

    it('should propagate other Prisma errors', async () => {
      const prismaError = new Prisma.PrismaClientKnownRequestError(
        'Foreign key constraint failed',
        {
          code: 'P2003',
          clientVersion: '7.8.0',
        },
      );
      mockPrismaService.part.delete.mockRejectedValue(prismaError);

      await expect(service.remove('TEST-001')).rejects.toThrow(
        Prisma.PrismaClientKnownRequestError,
      );
    });

    it('should handle database errors', async () => {
      const dbError = new Error('Database connection lost');
      mockPrismaService.part.delete.mockRejectedValue(dbError);

      await expect(service.remove('TEST-001')).rejects.toThrow(
        'Database connection lost',
      );
    });
  });

  describe('addLog', () => {
    const logBody = {
      step: 'inspection',
      operator: 'QAOperator',
    };

    it('should successfully add a log to an existing part', async () => {
      mockPrismaService.part.findUnique.mockResolvedValue(mockPart);
      mockPrismaService.log.create.mockResolvedValue(mockLog);

      const result = await service.addLog('TEST-001', logBody);

      expect(prisma.part.findUnique).toHaveBeenCalledWith({
        where: { serialId: 'TEST-001' },
      });
      expect(prisma.log.create).toHaveBeenCalledWith({
        data: {
          step: logBody.step,
          operator: logBody.operator,
          partId: mockPart.id,
        },
      });
      expect(result).toEqual(mockLog);
    });

    it('should throw NotFoundException when part does not exist', async () => {
      mockPrismaService.part.findUnique.mockResolvedValue(null);

      await expect(service.addLog('nonexistent', logBody)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.addLog('nonexistent', logBody)).rejects.toThrow(
        'Part with serialId nonexistent not found',
      );
      expect(prisma.log.create).not.toHaveBeenCalled();
    });

    it('should create log with correct partId', async () => {
      mockPrismaService.part.findUnique.mockResolvedValue(mockPart);
      mockPrismaService.log.create.mockResolvedValue(mockLog);

      await service.addLog('TEST-001', logBody);

      expect(prisma.log.create).toHaveBeenCalledWith({
        data: {
          step: logBody.step,
          operator: logBody.operator,
          partId: mockPart.id,
        },
      });
    });

    it('should handle missing step field', async () => {
      const invalidBody = { operator: 'QAOperator' } as any;
      mockPrismaService.part.findUnique.mockResolvedValue(mockPart);

      const validationError = new Prisma.PrismaClientValidationError(
        'Argument `step` is missing',
        { clientVersion: '7.8.0' },
      );
      mockPrismaService.log.create.mockRejectedValue(validationError);

      await expect(service.addLog('TEST-001', invalidBody)).rejects.toThrow(
        Prisma.PrismaClientValidationError,
      );
    });

    it('should handle missing operator field', async () => {
      const invalidBody = { step: 'inspection' } as any;
      mockPrismaService.part.findUnique.mockResolvedValue(mockPart);

      const validationError = new Prisma.PrismaClientValidationError(
        'Argument `operator` is missing',
        { clientVersion: '7.8.0' },
      );
      mockPrismaService.log.create.mockRejectedValue(validationError);

      await expect(service.addLog('TEST-001', invalidBody)).rejects.toThrow(
        Prisma.PrismaClientValidationError,
      );
    });

    it('should allow adding multiple logs to same part', async () => {
      mockPrismaService.part.findUnique.mockResolvedValue(mockPart);
      mockPrismaService.log.create
        .mockResolvedValueOnce(mockLog)
        .mockResolvedValueOnce({
          ...mockLog,
          id: 3,
          step: 'assembly',
          operator: 'AssemblyOperator',
        });

      const log1 = await service.addLog('TEST-001', {
        step: 'inspection',
        operator: 'QAOperator',
      });
      const log2 = await service.addLog('TEST-001', {
        step: 'assembly',
        operator: 'AssemblyOperator',
      });

      expect(log1.step).toBe('inspection');
      expect(log2.step).toBe('assembly');
      expect(prisma.log.create).toHaveBeenCalledTimes(2);
    });

    it('should handle database errors when creating log', async () => {
      mockPrismaService.part.findUnique.mockResolvedValue(mockPart);
      const dbError = new Error('Failed to insert log');
      mockPrismaService.log.create.mockRejectedValue(dbError);

      await expect(service.addLog('TEST-001', logBody)).rejects.toThrow(
        'Failed to insert log',
      );
    });
  });

  describe('Edge cases and error handling', () => {
    it('should handle null or undefined inputs gracefully', async () => {
      mockPrismaService.part.findUnique.mockResolvedValue(null);

      const resultNull = await service.findOne(null as any);
      const resultUndefined = await service.findOne(undefined as any);

      expect(resultNull).toBeNull();
      expect(resultUndefined).toBeNull();
    });

    it('should handle very long serialId strings', async () => {
      const longSerialId = 'A'.repeat(1000);
      mockPrismaService.part.findUnique.mockResolvedValue(null);

      const result = await service.findOne(longSerialId);

      expect(prisma.part.findUnique).toHaveBeenCalledWith({
        where: { serialId: longSerialId },
        include: { logs: true },
      });
      expect(result).toBeNull();
    });

    it('should handle special characters in serialId', async () => {
      const specialSerialId = 'TEST-@#$%^&*()';
      mockPrismaService.part.findUnique.mockResolvedValue(null);

      const result = await service.findOne(specialSerialId);

      expect(prisma.part.findUnique).toHaveBeenCalledWith({
        where: { serialId: specialSerialId },
        include: { logs: true },
      });
    });

    it('should handle concurrent database operations', async () => {
      mockPrismaService.part.findUnique.mockResolvedValue(mockPart);
      mockPrismaService.part.update.mockResolvedValue({
        ...mockPart,
        status: 'completed',
      });

      const [findResult, updateResult] = await Promise.all([
        service.findOne('TEST-001'),
        service.update('TEST-001', { status: 'completed' }),
      ]);

      expect(findResult).toBeDefined();
      expect(updateResult).toBeDefined();
    });
  });
});
