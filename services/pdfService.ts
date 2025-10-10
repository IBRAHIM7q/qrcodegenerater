import { prisma } from '../lib/prisma';

export const getViewUrl = async (id: string): Promise<string | null> => {
  try {
    const pdf = await prisma.pDF.findUnique({
      where: { id },
    });
    
    if (!pdf) {
      return null;
    }
    
    // Return the file path that can be served statically
    return `/uploads/${id}${pdf.path.substring(pdf.path.lastIndexOf('.'))}`;
  } catch (error) {
    console.error('Error fetching PDF:', error);
    return null;
  }
};