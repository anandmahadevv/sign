import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';

// Register a modern font if you have one, or just use the defaults
// Font.register({ family: 'Inter', src: '...' });

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#333',
    lineHeight: 1.5,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    borderBottom: '1px solid #000',
    paddingBottom: 10,
  },
  section: {
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  column: {
    flexDirection: 'column',
    width: '48%',
  },
  heading: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#000',
  },
  bold: {
    fontWeight: 'bold',
  },
  htmlContainer: {
    // Basic styling for the html content since react-pdf doesn't render HTML out of the box easily without a plugin.
    // For simplicity, we will just render the raw text of the description/deliverables or use a simple mapping.
    // In a real robust app, you'd use react-pdf-html. For now, we'll strip tags.
  },
  signatures: {
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signatureBox: {
    width: '45%',
  },
  signatureLine: {
    borderBottom: '1px solid #000',
    height: 40,
    marginBottom: 5,
    justifyContent: 'flex-end',
  },
  signatureImage: {
    maxHeight: 35,
    objectFit: 'contain',
  },
  signatureText: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  signatureDate: {
    fontSize: 8,
    color: '#666',
  }
});

function stripHtml(html: string) {
  if (!html) return '';
  return html.replace(/<[^>]*>?/gm, '');
}

export function AgreementPDF({ data }: { data: any }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>CLIENT AGREEMENT</Text>

        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.bold}>Provider:</Text>
            <Text>HackArena</Text>
            <Text>Agency OS Portal</Text>
          </View>
          <View style={[styles.column, { alignItems: 'flex-end' }]}>
            <Text style={styles.bold}>Client:</Text>
            <Text>{data.clientName || '[Client Name]'}</Text>
            <Text>{data.companyName || '[Company Name]'}</Text>
            <Text>{data.address || '[Address]'}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>1. Project Overview</Text>
          <Text>
            This agreement outlines the terms for the <Text style={styles.bold}>{data.projectName || '[Project Name]'}</Text> ({data.projectType || 'Project Type'}).
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>2. Description</Text>
          <Text>{stripHtml(data.description || '[Project Description]')}</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.heading}>3. Deliverables</Text>
          <Text>{stripHtml(data.deliverables || '[Deliverables]')}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>4. Timeline</Text>
          <Text>
            Project commences on <Text style={styles.bold}>{data.startDate || '[Start Date]'}</Text> and is expected to conclude on <Text style={styles.bold}>{data.completionDate || '[End Date]'}</Text>.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>5. Payment Terms</Text>
          <Text>Total Project Cost: <Text style={styles.bold}>${data.totalCost || '0.00'}</Text></Text>
          <Text>Advance Payment: <Text style={styles.bold}>${data.advancePayment || '0.00'}</Text></Text>
          <Text>Schedule: {data.paymentSchedule || '[Payment Schedule]'}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>6. Legal & Ownership</Text>
          <Text>{data.ownership}</Text>
        </View>

        <View style={styles.signatures}>
          <View style={styles.signatureBox}>
            <View style={styles.signatureLine}>
              {data.providerSignature && (
                <Image src={data.providerSignature} style={styles.signatureImage} />
              )}
            </View>
            <Text style={styles.signatureText}>{data.providerName || 'HackArena Representative'}</Text>
            <Text style={styles.signatureDate}>Date: {new Date().toLocaleDateString()}</Text>
          </View>

          <View style={styles.signatureBox}>
            <View style={styles.signatureLine}></View>
            <Text style={styles.signatureText}>{data.clientName || 'Client'} Signature</Text>
            <Text style={styles.signatureDate}>Date: _______________</Text>
          </View>
        </View>

      </Page>
    </Document>
  );
}
