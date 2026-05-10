import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { PartsController } from '../src/parts/parts.controller';
import { PartsService } from '../src/parts/parts.service';
import { CreatePartDto } from '../src/parts/dto/create-part.dto';
import { UpdatePartDto } from '../src/parts/dto/update-part.dto';

describe('PartsController', () => {
  let controller: PartsController;
  let service: PartsService;

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

  const mockPartsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    addLog: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PartsController],
      providers: [
        {
          provide: PartsService,
          useValue: mockPartsService,
        },
      ],
    }).compile();

    controller = module.get<PartsController>(PartsController);
    service = module.get<PartsService>(PartsService);

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createPartDto: CreatePartDto = {
      serialId: 'TEST-001',
      operator: 'TestOperator',
      partName: 'Test Part',
      partDescription: 'A test part',
      status: 'pending',
      part: [],
      logs: [],
    };

    it('should successfully create a part', async () => {
      mockPartsService.create.mockResolvedValue(mockPart);

      const result = await controller.create(createPartDto);

      expect(service.create).toHaveBeenCalledWith(createPartDto);
      expect(service.create).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockPart);
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('serialId', 'TEST-001');
      expect(result).toHaveProperty('logs');
      expect(result.logs).toHaveLength(1);
      expect(result.logs[0].step).toBe('created');
    });

    it('should fail when creating a part with duplicate serialId', async () => {
      const duplicateError = new Error('Unique constraint failed on serialId');
      mockPartsService.create.mockRejectedValue(duplicateError);

      await expect(controller.create(createPartDto)).rejects.toThrow(
        'Unique constraint failed on serialId',
      );
      expect(service.create).toHaveBeenCalledWith(createPartDto);
    });

    it('should handle database connection errors', async () => {
      const dbError = new Error('Database connection failed');
      mockPartsService.create.mockRejectedValue(dbError);

      await expect(controller.create(createPartDto)).rejects.toThrow(
        'Database connection failed',
      );
    });

    it('should create part with all required fields', async () => {
      mockPartsService.create.mockResolvedValue(mockPart);

      const result = await controller.create(createPartDto);

      expect(result.serialId).toBe(createPartDto.serialId);
      expect(result.partName).toBe(createPartDto.partName);
      expect(result.partDescription).toBe(createPartDto.partDescription);
      expect(result.status).toBe(createPartDto.status);
    });
  });

  describe('findAll', () => {
    it('should return an array of parts', async () => {
      const mockParts = [mockPart];
      mockPartsService.findAll.mockResolvedValue(mockParts);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(service.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockParts);
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(1);
    });

    it('should return an empty array when no parts exist', async () => {
      mockPartsService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should return multiple parts with their logs', async () => {
      const mockParts = [
        mockPart,
        {
          ...mockPart,
          id: 2,
          serialId: 'TEST-002',
          partName: 'Second Part',
          logs: [
            {
              id: 3,
              step: 'created',
              operator: 'AnotherOperator',
              timestamp: new Date('2026-05-10T17:00:00.000Z'),
              partId: 2,
            },
          ],
        },
      ];
      mockPartsService.findAll.mockResolvedValue(mockParts);

      const result = await controller.findAll();

      expect(result).toHaveLength(2);
      expect(result[0].logs).toBeDefined();
      expect(result[1].logs).toBeDefined();
    });

    it('should handle database errors when fetching parts', async () => {
      const dbError = new Error('Database query failed');
      mockPartsService.findAll.mockRejectedValue(dbError);

      await expect(controller.findAll()).rejects.toThrow('Database query failed');
    });
  });

  describe('findOne', () => {
    it('should return a single part by serialId', async () => {
      mockPartsService.findOne.mockResolvedValue(mockPart);

      const result = await controller.findOne('TEST-001');

      expect(service.findOne).toHaveBeenCalledWith('TEST-001');
      expect(service.findOne).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockPart);
      expect(result.serialId).toBe('TEST-001');
    });

    it('should return null when part is not found', async () => {
      mockPartsService.findOne.mockResolvedValue(null);

      const result = await controller.findOne('nonexistent');

      expect(service.findOne).toHaveBeenCalledWith('nonexistent');
      expect(result).toBeNull();
    });

    it('should include logs when returning a part', async () => {
      mockPartsService.findOne.mockResolvedValue(mockPart);

      const result = await controller.findOne('TEST-001');

      expect(result.logs).toBeDefined();
      expect(Array.isArray(result.logs)).toBe(true);
      expect(result.logs.length).toBeGreaterThan(0);
    });

    it('should handle database errors', async () => {
      const dbError = new Error('Database connection lost');
      mockPartsService.findOne.mockRejectedValue(dbError);

      await expect(controller.findOne('TEST-001')).rejects.toThrow(
        'Database connection lost',
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
      mockPartsService.update.mockResolvedValue(updatedPart);

      const result = await controller.update('TEST-001', updatePartDto);

      expect(service.update).toHaveBeenCalledWith('TEST-001', updatePartDto);
      expect(service.update).toHaveBeenCalledTimes(1);
      expect(result).toEqual(updatedPart);
      expect(result.status).toBe('completed');
      expect(result.partDescription).toBe('Updated description');
    });

    it('should throw NotFoundException when part does not exist', async () => {
      mockPartsService.update.mockRejectedValue(
        new NotFoundException('Part with serialId nonexistent not found'),
      );

      await expect(controller.update('nonexistent', updatePartDto)).rejects.toThrow(
        NotFoundException,
      );
      await expect(controller.update('nonexistent', updatePartDto)).rejects.toThrow(
        'Part with serialId nonexistent not found',
      );
    });

    it('should allow partial updates', async () => {
      const partialUpdate: UpdatePartDto = { status: 'in-progress' };
      const partiallyUpdatedPart = {
        ...mockPart,
        status: 'in-progress',
      };
      mockPartsService.update.mockResolvedValue(partiallyUpdatedPart);

      const result = await controller.update('TEST-001', partialUpdate);

      expect(result.status).toBe('in-progress');
      expect(result.partName).toBe(mockPart.partName); // Should remain unchanged
      expect(result.partDescription).toBe(mockPart.partDescription); // Should remain unchanged
    });

    it('should not update serialId field', async () => {
      // UpdatePartDto excludes serialId, so this shouldn't be possible
      const updateDto: UpdatePartDto = {
        partName: 'Updated Name',
      };
      const updatedPart = {
        ...mockPart,
        partName: 'Updated Name',
      };
      mockPartsService.update.mockResolvedValue(updatedPart);

      const result = await controller.update('TEST-001', updateDto);

      expect(result.serialId).toBe('TEST-001'); // Should remain unchanged
      expect(result.partName).toBe('Updated Name');
    });

    it('should handle database errors during update', async () => {
      const dbError = new Error('Database update failed');
      mockPartsService.update.mockRejectedValue(dbError);

      await expect(controller.update('TEST-001', updatePartDto)).rejects.toThrow(
        'Database update failed',
      );
    });
  });

  describe('addLog', () => {
    const logBody = {
      step: 'inspection',
      operator: 'QAOperator',
    };

    it('should successfully add a log to an existing part', async () => {
      mockPartsService.addLog.mockResolvedValue(mockLog);

      const result = await controller.addLog('TEST-001', logBody);

      expect(service.addLog).toHaveBeenCalledWith('TEST-001', logBody);
      expect(service.addLog).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockLog);
      expect(result.step).toBe('inspection');
      expect(result.operator).toBe('QAOperator');
      expect(result).toHaveProperty('timestamp');
    });

    it('should throw NotFoundException when part does not exist', async () => {
      mockPartsService.addLog.mockRejectedValue(
        new NotFoundException('Part with serialId nonexistent not found'),
      );

      await expect(controller.addLog('nonexistent', logBody)).rejects.toThrow(
        NotFoundException,
      );
      await expect(controller.addLog('nonexistent', logBody)).rejects.toThrow(
        'Part with serialId nonexistent not found',
      );
    });

    it('should fail when step is missing', async () => {
      const invalidBody = { operator: 'QAOperator' } as any;
      const validationError = new Error('Argument `step` is missing');
      mockPartsService.addLog.mockRejectedValue(validationError);

      await expect(controller.addLog('TEST-001', invalidBody)).rejects.toThrow(
        'Argument `step` is missing',
      );
    });

    it('should fail when operator is missing', async () => {
      const invalidBody = { step: 'inspection' } as any;
      const validationError = new Error('Argument `operator` is missing');
      mockPartsService.addLog.mockRejectedValue(validationError);

      await expect(controller.addLog('TEST-001', invalidBody)).rejects.toThrow(
        'Argument `operator` is missing',
      );
    });

    it('should create log with correct partId', async () => {
      mockPartsService.addLog.mockResolvedValue(mockLog);

      const result = await controller.addLog('TEST-001', logBody);

      expect(result.partId).toBe(1);
    });

    it('should handle database errors when adding log', async () => {
      const dbError = new Error('Failed to insert log');
      mockPartsService.addLog.mockRejectedValue(dbError);

      await expect(controller.addLog('TEST-001', logBody)).rejects.toThrow(
        'Failed to insert log',
      );
    });

    it('should allow adding multiple logs to the same part', async () => {
      const firstLog = mockLog;
      const secondLog = {
        ...mockLog,
        id: 3,
        step: 'assembly',
        operator: 'AssemblyOperator',
      };

      mockPartsService.addLog
        .mockResolvedValueOnce(firstLog)
        .mockResolvedValueOnce(secondLog);

      const result1 = await controller.addLog('TEST-001', {
        step: 'inspection',
        operator: 'QAOperator',
      });
      const result2 = await controller.addLog('TEST-001', {
        step: 'assembly',
        operator: 'AssemblyOperator',
      });

      expect(result1.step).toBe('inspection');
      expect(result2.step).toBe('assembly');
      expect(service.addLog).toHaveBeenCalledTimes(2);
    });
  });

  describe('remove', () => {
    it('should successfully delete a part', async () => {
      mockPartsService.remove.mockResolvedValue(mockPart);

      const result = await controller.remove('TEST-001');

      expect(service.remove).toHaveBeenCalledWith('TEST-001');
      expect(service.remove).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockPart);
      expect(result.serialId).toBe('TEST-001');
    });

    it('should throw NotFoundException when part does not exist', async () => {
      mockPartsService.remove.mockRejectedValue(
        new NotFoundException('Part with serialId nonexistent not found'),
      );

      await expect(controller.remove('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
      await expect(controller.remove('nonexistent')).rejects.toThrow(
        'Part with serialId nonexistent not found',
      );
    });

    it('should return the deleted part with its logs', async () => {
      mockPartsService.remove.mockResolvedValue(mockPart);

      const result = await controller.remove('TEST-001');

      expect(result.logs).toBeDefined();
      expect(Array.isArray(result.logs)).toBe(true);
    });

    it('should handle database errors during deletion', async () => {
      const dbError = new Error('Failed to delete part');
      mockPartsService.remove.mockRejectedValue(dbError);

      await expect(controller.remove('TEST-001')).rejects.toThrow(
        'Failed to delete part',
      );
    });

    it('should not allow deleting the same part twice', async () => {
      mockPartsService.remove
        .mockResolvedValueOnce(mockPart)
        .mockRejectedValueOnce(
          new NotFoundException('Part with serialId TEST-001 not found'),
        );

      const firstDelete = await controller.remove('TEST-001');
      expect(firstDelete).toEqual(mockPart);

      await expect(controller.remove('TEST-001')).rejects.toThrow(
        NotFoundException,
      );
      expect(service.remove).toHaveBeenCalledTimes(2);
    });
  });

  describe('Integration scenarios', () => {
    it('should handle a complete part lifecycle', async () => {
      const createDto: CreatePartDto = {
        serialId: 'LIFECYCLE-001',
        operator: 'TestOperator',
        partName: 'Lifecycle Part',
        partDescription: 'Testing lifecycle',
        status: 'pending',
        part: [],
        logs: [],
      };

      const createdPart = {
        id: 10,
        serialId: 'LIFECYCLE-001',
        partName: 'Lifecycle Part',
        partDescription: 'Testing lifecycle',
        status: 'pending',
        createdAt: new Date(),
        logs: [
          {
            id: 20,
            step: 'created',
            operator: 'TestOperator',
            timestamp: new Date(),
            partId: 10,
          },
        ],
      };

      // Create
      mockPartsService.create.mockResolvedValue(createdPart);
      const created = await controller.create(createDto);
      expect(created.serialId).toBe('LIFECYCLE-001');
      expect(created.status).toBe('pending');

      // Add log
      mockPartsService.addLog.mockResolvedValue({
        id: 21,
        step: 'inspection',
        operator: 'QAOperator',
        timestamp: new Date(),
        partId: 10,
      });
      const log = await controller.addLog('LIFECYCLE-001', {
        step: 'inspection',
        operator: 'QAOperator',
      });
      expect(log.step).toBe('inspection');

      // Update
      const updatedPart = { ...createdPart, status: 'completed' };
      mockPartsService.update.mockResolvedValue(updatedPart);
      const updated = await controller.update('LIFECYCLE-001', {
        status: 'completed',
      });
      expect(updated.status).toBe('completed');

      // Delete
      mockPartsService.remove.mockResolvedValue(updatedPart);
      const deleted = await controller.remove('LIFECYCLE-001');
      expect(deleted.serialId).toBe('LIFECYCLE-001');
    });

    it('should handle concurrent operations gracefully', async () => {
      mockPartsService.findOne.mockResolvedValue(mockPart);
      mockPartsService.update.mockResolvedValue({
        ...mockPart,
        status: 'completed',
      });

      const [findResult, updateResult] = await Promise.all([
        controller.findOne('TEST-001'),
        controller.update('TEST-001', { status: 'completed' }),
      ]);

      expect(findResult).toBeDefined();
      expect(updateResult).toBeDefined();
      expect(service.findOne).toHaveBeenCalled();
      expect(service.update).toHaveBeenCalled();
    });

    it('should maintain data integrity across operations', async () => {
      const part = { ...mockPart };
      mockPartsService.findOne.mockResolvedValue(part);
      mockPartsService.update.mockResolvedValue({
        ...part,
        partDescription: 'Updated',
      });

      const original = await controller.findOne('TEST-001');
      const updated = await controller.update('TEST-001', {
        partDescription: 'Updated',
      });

      expect(updated.serialId).toBe(original.serialId);
      expect(updated.id).toBe(original.id);
      expect(updated.partDescription).not.toBe(original.partDescription);
    });
  });
});
