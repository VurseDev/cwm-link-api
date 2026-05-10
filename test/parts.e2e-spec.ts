import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Parts API (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    // Apply the same validation pipe as in main.ts
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    prisma = moduleFixture.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    // Clean up database before each test
    await prisma.log.deleteMany();
    await prisma.part.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  describe('POST /parts', () => {
    it('should create a new part with valid data', () => {
      return request(app.getHttpServer())
        .post('/parts')
        .send({
          serialId: 'PART-001',
          operator: 'John Doe',
          partName: 'Metal Plate',
          partDescription: 'A standard metal plate',
          status: 'pending',
          part: [],
          logs: [],
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.serialId).toBe('PART-001');
          expect(res.body.partName).toBe('Metal Plate');
          expect(res.body.partDescription).toBe('A standard metal plate');
          expect(res.body.status).toBe('pending');
          expect(res.body).toHaveProperty('createdAt');
          expect(res.body).toHaveProperty('logs');
          expect(Array.isArray(res.body.logs)).toBe(true);
          expect(res.body.logs.length).toBe(1);
          expect(res.body.logs[0].step).toBe('created');
          expect(res.body.logs[0].operator).toBe('John Doe');
        });
    });

    it('should fail when creating a part with duplicate serialId', async () => {
      // Create first part
      await request(app.getHttpServer())
        .post('/parts')
        .send({
          serialId: 'PART-001',
          operator: 'John Doe',
          partName: 'Metal Plate',
          partDescription: 'A standard metal plate',
          status: 'pending',
          part: [],
          logs: [],
        })
        .expect(201);

      // Try to create duplicate
      return request(app.getHttpServer())
        .post('/parts')
        .send({
          serialId: 'PART-001',
          operator: 'Jane Doe',
          partName: 'Another Part',
          partDescription: 'Should fail',
          status: 'pending',
          part: [],
          logs: [],
        })
        .expect(500);
    });

    it('should fail when serialId is missing', () => {
      return request(app.getHttpServer())
        .post('/parts')
        .send({
          operator: 'John Doe',
          partName: 'Metal Plate',
          partDescription: 'A standard metal plate',
          status: 'pending',
          part: [],
          logs: [],
        })
        .expect(400)
        .expect((res) => {
          expect(res.body).toHaveProperty('statusCode', 400);
          expect(res.body).toHaveProperty('error', 'Bad Request');
        });
    });

    it('should fail when serialId is not a string', () => {
      return request(app.getHttpServer())
        .post('/parts')
        .send({
          serialId: 12345,
          operator: 'John Doe',
          partName: 'Metal Plate',
          partDescription: 'A standard metal plate',
          status: 'pending',
          part: [],
          logs: [],
        })
        .expect(400)
        .expect((res) => {
          expect(res.body).toHaveProperty('statusCode', 400);
          expect(res.body).toHaveProperty('error', 'Bad Request');
        });
    });

    it('should fail with invalid JSON', () => {
      return request(app.getHttpServer())
        .post('/parts')
        .set('Content-Type', 'application/json')
        .send('invalid json')
        .expect(400)
        .expect((res) => {
          expect(res.body).toHaveProperty('statusCode', 400);
          expect(res.body).toHaveProperty('error', 'Bad Request');
        });
    });

    it('should fail when required fields are missing', () => {
      return request(app.getHttpServer())
        .post('/parts')
        .send({
          serialId: 'PART-001',
        })
        .expect(400)
        .expect((res) => {
          expect(res.body).toHaveProperty('statusCode', 400);
          expect(res.body).toHaveProperty('error', 'Bad Request');
        });
    });
  });

  describe('GET /parts', () => {
    it('should return an empty array when no parts exist', () => {
      return request(app.getHttpServer())
        .get('/parts')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBe(0);
        });
    });

    it('should return all parts with their logs', async () => {
      // Create two parts
      await request(app.getHttpServer()).post('/parts').send({
        serialId: 'PART-001',
        operator: 'John Doe',
        partName: 'Metal Plate',
        partDescription: 'A standard metal plate',
        status: 'pending',
        part: [],
        logs: [],
      });

      await request(app.getHttpServer()).post('/parts').send({
        serialId: 'PART-002',
        operator: 'Jane Doe',
        partName: 'Plastic Cover',
        partDescription: 'A plastic cover',
        status: 'completed',
        part: [],
        logs: [],
      });

      return request(app.getHttpServer())
        .get('/parts')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBe(2);
          expect(res.body[0]).toHaveProperty('id');
          expect(res.body[0]).toHaveProperty('serialId');
          expect(res.body[0]).toHaveProperty('logs');
          expect(Array.isArray(res.body[0].logs)).toBe(true);
        });
    });
  });

  describe('GET /parts/:id', () => {
    it('should return a part by serialId', async () => {
      // Create a part
      await request(app.getHttpServer()).post('/parts').send({
        serialId: 'PART-001',
        operator: 'John Doe',
        partName: 'Metal Plate',
        partDescription: 'A standard metal plate',
        status: 'pending',
        part: [],
        logs: [],
      });

      return request(app.getHttpServer())
        .get('/parts/PART-001')
        .expect(200)
        .expect((res) => {
          expect(res.body.serialId).toBe('PART-001');
          expect(res.body.partName).toBe('Metal Plate');
          expect(res.body).toHaveProperty('logs');
          expect(Array.isArray(res.body.logs)).toBe(true);
        });
    });

    it('should return nothing when part does not exist', () => {
      return request(app.getHttpServer())
        .get('/parts/nonexistent')
        .expect(200)
        .expect('');
    });
  });

  describe('PATCH /parts/:id', () => {
    it('should update a part with valid data', async () => {
      // Create a part
      await request(app.getHttpServer()).post('/parts').send({
        serialId: 'PART-001',
        operator: 'John Doe',
        partName: 'Metal Plate',
        partDescription: 'A standard metal plate',
        status: 'pending',
        part: [],
        logs: [],
      });

      return request(app.getHttpServer())
        .patch('/parts/PART-001')
        .send({
          status: 'completed',
          partDescription: 'Updated description',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.serialId).toBe('PART-001');
          expect(res.body.status).toBe('completed');
          expect(res.body.partDescription).toBe('Updated description');
          expect(res.body.partName).toBe('Metal Plate'); // Should remain unchanged
        });
    });

    it('should fail when updating a non-existent part', () => {
      return request(app.getHttpServer())
        .patch('/parts/nonexistent')
        .send({
          status: 'completed',
        })
        .expect(404)
        .expect((res) => {
          expect(res.body).toHaveProperty('statusCode', 404);
          expect(res.body).toHaveProperty('error', 'Not Found');
          expect(res.body.message).toContain('not found');
        });
    });

    it('should allow partial updates', async () => {
      // Create a part
      await request(app.getHttpServer()).post('/parts').send({
        serialId: 'PART-001',
        operator: 'John Doe',
        partName: 'Metal Plate',
        partDescription: 'A standard metal plate',
        status: 'pending',
        part: [],
        logs: [],
      });

      return request(app.getHttpServer())
        .patch('/parts/PART-001')
        .send({
          status: 'in-progress',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.status).toBe('in-progress');
          expect(res.body.partName).toBe('Metal Plate');
          expect(res.body.partDescription).toBe('A standard metal plate');
        });
    });
  });

  describe('POST /parts/:serialId/log', () => {
    it('should add a log to an existing part', async () => {
      // Create a part
      await request(app.getHttpServer()).post('/parts').send({
        serialId: 'PART-001',
        operator: 'John Doe',
        partName: 'Metal Plate',
        partDescription: 'A standard metal plate',
        status: 'pending',
        part: [],
        logs: [],
      });

      return request(app.getHttpServer())
        .post('/parts/PART-001/log')
        .send({
          step: 'inspection',
          operator: 'QA Operator',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.step).toBe('inspection');
          expect(res.body.operator).toBe('QA Operator');
          expect(res.body).toHaveProperty('timestamp');
          expect(res.body).toHaveProperty('partId');
        });
    });

    it('should fail when adding a log to a non-existent part', () => {
      return request(app.getHttpServer())
        .post('/parts/nonexistent/log')
        .send({
          step: 'inspection',
          operator: 'QA Operator',
        })
        .expect(404)
        .expect((res) => {
          expect(res.body).toHaveProperty('statusCode', 404);
          expect(res.body).toHaveProperty('error', 'Not Found');
          expect(res.body.message).toContain('not found');
        });
    });

    it('should fail when step is missing', async () => {
      // Create a part
      await request(app.getHttpServer()).post('/parts').send({
        serialId: 'PART-001',
        operator: 'John Doe',
        partName: 'Metal Plate',
        partDescription: 'A standard metal plate',
        status: 'pending',
        part: [],
        logs: [],
      });

      return request(app.getHttpServer())
        .post('/parts/PART-001/log')
        .send({
          operator: 'QA Operator',
        })
        .expect(500);
    });

    it('should fail when operator is missing', async () => {
      // Create a part
      await request(app.getHttpServer()).post('/parts').send({
        serialId: 'PART-001',
        operator: 'John Doe',
        partName: 'Metal Plate',
        partDescription: 'A standard metal plate',
        status: 'pending',
        part: [],
        logs: [],
      });

      return request(app.getHttpServer())
        .post('/parts/PART-001/log')
        .send({
          step: 'inspection',
        })
        .expect(500);
    });

    it('should add multiple logs to the same part', async () => {
      // Create a part
      await request(app.getHttpServer()).post('/parts').send({
        serialId: 'PART-001',
        operator: 'John Doe',
        partName: 'Metal Plate',
        partDescription: 'A standard metal plate',
        status: 'pending',
        part: [],
        logs: [],
      });

      // Add first log
      await request(app.getHttpServer())
        .post('/parts/PART-001/log')
        .send({
          step: 'inspection',
          operator: 'QA Operator',
        })
        .expect(201);

      // Add second log
      await request(app.getHttpServer())
        .post('/parts/PART-001/log')
        .send({
          step: 'assembly',
          operator: 'Assembly Operator',
        })
        .expect(201);

      // Verify both logs exist
      return request(app.getHttpServer())
        .get('/parts/PART-001')
        .expect(200)
        .expect((res) => {
          expect(res.body.logs.length).toBeGreaterThanOrEqual(2);
          const logSteps = res.body.logs.map((log: any) => log.step);
          expect(logSteps).toContain('inspection');
          expect(logSteps).toContain('assembly');
        });
    });
  });

  describe('DELETE /parts/:id', () => {
    it('should delete an existing part', async () => {
      // Create a part
      await request(app.getHttpServer()).post('/parts').send({
        serialId: 'PART-001',
        operator: 'John Doe',
        partName: 'Metal Plate',
        partDescription: 'A standard metal plate',
        status: 'pending',
        part: [],
        logs: [],
      });

      return request(app.getHttpServer())
        .delete('/parts/PART-001')
        .expect(200)
        .expect((res) => {
          expect(res.body.serialId).toBe('PART-001');
          expect(res.body).toHaveProperty('logs');
        });
    });

    it('should fail when deleting a non-existent part', () => {
      return request(app.getHttpServer())
        .delete('/parts/nonexistent')
        .expect(404)
        .expect((res) => {
          expect(res.body).toHaveProperty('statusCode', 404);
          expect(res.body).toHaveProperty('error', 'Not Found');
          expect(res.body.message).toContain('not found');
        });
    });

    it('should cascade delete logs when deleting a part', async () => {
      // Create a part
      await request(app.getHttpServer()).post('/parts').send({
        serialId: 'PART-001',
        operator: 'John Doe',
        partName: 'Metal Plate',
        partDescription: 'A standard metal plate',
        status: 'pending',
        part: [],
        logs: [],
      });

      // Add a log
      await request(app.getHttpServer())
        .post('/parts/PART-001/log')
        .send({
          step: 'inspection',
          operator: 'QA Operator',
        })
        .expect(201);

      // Delete the part
      await request(app.getHttpServer())
        .delete('/parts/PART-001')
        .expect(200);

      // Verify part is deleted
      return request(app.getHttpServer())
        .get('/parts/PART-001')
        .expect(200)
        .expect('');
    });

    it('should not allow deleting the same part twice', async () => {
      // Create a part
      await request(app.getHttpServer()).post('/parts').send({
        serialId: 'PART-001',
        operator: 'John Doe',
        partName: 'Metal Plate',
        partDescription: 'A standard metal plate',
        status: 'pending',
        part: [],
        logs: [],
      });

      // Delete the part
      await request(app.getHttpServer())
        .delete('/parts/PART-001')
        .expect(200);

      // Try to delete again
      return request(app.getHttpServer())
        .delete('/parts/PART-001')
        .expect(404);
    });
  });

  describe('Integration Workflow', () => {
    it('should handle a complete part lifecycle', async () => {
      // 1. Create a part
      const createResponse = await request(app.getHttpServer())
        .post('/parts')
        .send({
          serialId: 'PART-WORKFLOW',
          operator: 'John Doe',
          partName: 'Test Part',
          partDescription: 'A part for workflow testing',
          status: 'pending',
          part: [],
          logs: [],
        })
        .expect(201);

      expect(createResponse.body.serialId).toBe('PART-WORKFLOW');
      expect(createResponse.body.status).toBe('pending');

      // 2. Add an inspection log
      await request(app.getHttpServer())
        .post('/parts/PART-WORKFLOW/log')
        .send({
          step: 'inspection',
          operator: 'QA Operator',
        })
        .expect(201);

      // 3. Update the part status
      await request(app.getHttpServer())
        .patch('/parts/PART-WORKFLOW')
        .send({
          status: 'in-progress',
        })
        .expect(200);

      // 4. Add an assembly log
      await request(app.getHttpServer())
        .post('/parts/PART-WORKFLOW/log')
        .send({
          step: 'assembly',
          operator: 'Assembly Operator',
        })
        .expect(201);

      // 5. Update to completed
      await request(app.getHttpServer())
        .patch('/parts/PART-WORKFLOW')
        .send({
          status: 'completed',
        })
        .expect(200);

      // 6. Verify final state
      const getResponse = await request(app.getHttpServer())
        .get('/parts/PART-WORKFLOW')
        .expect(200);

      expect(getResponse.body.status).toBe('completed');
      expect(getResponse.body.logs.length).toBeGreaterThanOrEqual(2);

      // 7. Delete the part
      await request(app.getHttpServer())
        .delete('/parts/PART-WORKFLOW')
        .expect(200);

      // 8. Verify deletion
      await request(app.getHttpServer())
        .get('/parts/PART-WORKFLOW')
        .expect(200)
        .expect('');
    });
  });
});
