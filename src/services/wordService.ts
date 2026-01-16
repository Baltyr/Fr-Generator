import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType } from 'docx';
import { PUData } from '@/types/fr.types';

/**
 * Servicio para generar archivos Word (PU - Pruebas Unitarias)
 * Usa docx.js para crear documentos preservando el formato
 */

class WordService {
  /**
   * Genera el archivo PU (Pruebas Unitarias) en Word
   */
  async generatePU(
    data: PUData,
    ambiente: 'QA' | 'PROD',
    cdpsp: string,
    basicInfo: any
  ): Promise<Blob> {
    try {
      // 1. Cargar template desde IndexedDB (no usado por ahora - se crea documento nuevo)
      // const templateBlob = await StorageService.getTemplate('PU');

      // 2. Para simplificar, vamos a crear un documento nuevo con estructura similar
      // En una implementación más avanzada, se podría cargar y modificar el template existente

      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              // Título
              new Paragraph({
                children: [
                  new TextRun({
                    text: `PRUEBAS UNITARIAS - ${cdpsp}`,
                    bold: true,
                    size: 32,
                  }),
                ],
                alignment: AlignmentType.CENTER,
                spacing: { after: 400 },
              }),

              // Ambiente
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Ambiente: ${ambiente}`,
                    bold: true,
                    size: 24,
                  }),
                ],
                alignment: AlignmentType.CENTER,
                spacing: { after: 400 },
              }),

              // Tabla de información general
              this.createInfoTable(data, basicInfo, cdpsp),

              // Espacio
              new Paragraph({
                text: '',
                spacing: { after: 300 },
              }),

              // Casos de prueba
              ...this.createTestCasesContent(data),
            ],
          },
        ],
      });

      // 3. Generar blob
      const buffer = await Packer.toBlob(doc);
      return buffer;
    } catch (error) {
      console.error('Error al generar PU:', error);
      throw new Error(`Error al generar archivo PU: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  /**
   * Crea la tabla de información general
   */
  private createInfoTable(data: PUData, basicInfo: any, cdpsp: string): Table {
    return new Table({
      width: {
        size: 100,
        type: WidthType.PERCENTAGE,
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: 'CDPSP:', bold: true })] })],
              width: { size: 30, type: WidthType.PERCENTAGE },
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: cdpsp })] })],
              width: { size: 70, type: WidthType.PERCENTAGE },
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: 'Título:', bold: true })] })],
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: basicInfo.titulo || '' })] })],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: 'Descripción:', bold: true })] })],
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: basicInfo.descripcion || '' })] })],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: 'Solicitante:', bold: true })] })],
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: basicInfo.solicitante || '' })] })],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: 'Tipo de Prueba:', bold: true })] })],
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: data.tipoPrueba || '' })] })],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: 'Ejecutor:', bold: true })] })],
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: data.ejecutor || '' })] })],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: 'Herramienta:', bold: true })] })],
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: data.herramienta || '' })] })],
            }),
          ],
        }),
      ],
    });
  }

  /**
   * Crea el contenido de los casos de prueba
   */
  private createTestCasesContent(data: PUData): Paragraph[] {
    const content: Paragraph[] = [];

    // Título de sección
    content.push(
      new Paragraph({
        children: [
          new TextRun({
            text: 'CASOS DE PRUEBA',
            bold: true,
            size: 28,
          }),
        ],
        spacing: { before: 400, after: 300 },
      })
    );

    // Iterar sobre cada caso de prueba
    if (data.casos && data.casos.length > 0) {
      data.casos.forEach((caso, index) => {
        // Número de caso
        content.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `Caso de Prueba ${index + 1}: ${caso.nombre}`,
                bold: true,
                size: 24,
              }),
            ],
            spacing: { before: 300, after: 200 },
          })
        );

        // Descripción
        content.push(
          new Paragraph({
            children: [
              new TextRun({ text: 'Descripción: ', bold: true }),
              new TextRun({ text: caso.descripcion || '' }),
            ],
            spacing: { after: 100 },
          })
        );

        // Precondiciones
        if (caso.precondiciones) {
          content.push(
            new Paragraph({
              children: [
                new TextRun({ text: 'Precondiciones: ', bold: true }),
                new TextRun({ text: caso.precondiciones }),
              ],
              spacing: { after: 100 },
            })
          );
        }

        // Pasos
        if (caso.pasos && caso.pasos.length > 0) {
          content.push(
            new Paragraph({
              children: [new TextRun({ text: 'Pasos para ejecutar:', bold: true })],
              spacing: { after: 100 },
            })
          );

          caso.pasos.forEach((paso, idx) => {
            content.push(
              new Paragraph({
                children: [new TextRun({ text: `${idx + 1}. ${paso}` })],
                spacing: { after: 50 },
                numbering: {
                  reference: 'default-numbering',
                  level: 0,
                },
              })
            );
          });
        }

        // Resultado esperado
        content.push(
          new Paragraph({
            children: [
              new TextRun({ text: 'Resultado Esperado: ', bold: true }),
              new TextRun({ text: caso.resultadoEsperado || '' }),
            ],
            spacing: { after: 100 },
          })
        );

        // Estado
        const estadoColor = this.getEstadoColor(caso.estado);
        content.push(
          new Paragraph({
            children: [
              new TextRun({ text: 'Estado: ', bold: true }),
              new TextRun({
                text: caso.estado || 'Pendiente',
                bold: true,
                color: estadoColor,
              }),
            ],
            spacing: { after: 200 },
          })
        );
      });
    } else {
      content.push(
        new Paragraph({
          children: [new TextRun({ text: 'No se han definido casos de prueba.', italics: true })],
        })
      );
    }

    // Observaciones
    if (data.observaciones) {
      content.push(
        new Paragraph({
          children: [
            new TextRun({
              text: 'OBSERVACIONES',
              bold: true,
              size: 28,
            }),
          ],
          spacing: { before: 400, after: 200 },
        })
      );

      content.push(
        new Paragraph({
          text: data.observaciones,
          spacing: { after: 200 },
        })
      );
    }

    return content;
  }

  /**
   * Obtiene el color según el estado
   */
  private getEstadoColor(estado?: string): string {
    switch (estado) {
      case 'Aprobado':
        return '10b981'; // Verde
      case 'Rechazado':
        return 'ef4444'; // Rojo
      case 'En Progreso':
        return 'f59e0b'; // Amarillo
      default:
        return '7c7d8a'; // Gris
    }
  }
}

export const wordService = new WordService();
