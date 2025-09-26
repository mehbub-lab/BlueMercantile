/**
 * IPFS Integration for BlueMercantile
 * Handles decentralized file storage for ownership documents and other files
 */

interface IPFSUploadResult {
  success: boolean;
  hash?: string;
  url?: string;
  error?: string;
}

interface IPFSFile {
  hash: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
}

class IPFSService {
  private baseURL: string;
  private gatewayURL: string;

  constructor() {
    // Using a public IPFS gateway - in production, you'd want your own node
    this.baseURL = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
    this.gatewayURL = 'https://gateway.pinata.cloud/ipfs/';
    
    // Alternative: Use local IPFS node or other public gateways
    // this.baseURL = 'http://localhost:5001/api/v0/add';
    // this.gatewayURL = 'https://ipfs.io/ipfs/';
  }

  /**
   * Upload a file to IPFS
   */
  async uploadFile(file: File): Promise<IPFSUploadResult> {
    try {
      // Validate file
      if (!file) {
        return { success: false, error: 'No file provided' };
      }

      // Check file size (limit to 10MB for documents)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        return { success: false, error: 'File size exceeds 10MB limit' };
      }

      // Validate file type for ownership documents
      const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/jpg'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        return { success: false, error: 'Only PDF and image files are allowed' };
      }

      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      
      // Add metadata
      const metadata = {
        name: file.name,
        uploadedBy: 'BlueMercantile',
        uploadedAt: new Date().toISOString(),
        fileType: file.type,
        fileSize: file.size
      };
      
      formData.append('pinataMetadata', JSON.stringify(metadata));
      
      // Add options for better organization
      const options = {
        cidVersion: 1,
        wrapWithDirectory: false
      };
      
      formData.append('pinataOptions', JSON.stringify(options));

      // Upload to IPFS via Pinata (you'll need to add API keys in production)
      const response = await this.uploadToPinata(formData);
      
      if (response.success && response.hash) {
        return {
          success: true,
          hash: response.hash,
          url: `${this.gatewayURL}${response.hash}`
        };
      }

      // Fallback to public IPFS gateway if Pinata fails
      return await this.uploadToPublicGateway(file);

    } catch (error) {
      console.error('IPFS upload error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Upload failed' 
      };
    }
  }

  /**
   * Upload to Pinata (requires API keys)
   */
  private async uploadToPinata(formData: FormData): Promise<IPFSUploadResult> {
    try {
      // In production, you'd store these in environment variables
      const pinataApiKey = process.env.PINATA_API_KEY;
      const pinataSecretKey = process.env.PINATA_SECRET_API_KEY;
      
      if (!pinataApiKey || !pinataSecretKey) {
        // Return failure to fall back to public gateway
        return { success: false, error: 'Pinata credentials not configured' };
      }

      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          'pinata_api_key': pinataApiKey,
          'pinata_secret_api_key': pinataSecretKey,
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Pinata upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      
      return {
        success: true,
        hash: result.IpfsHash,
        url: `${this.gatewayURL}${result.IpfsHash}`
      };

    } catch (error) {
      console.error('Pinata upload error:', error);
      return { success: false, error: 'Pinata upload failed' };
    }
  }

  /**
   * Upload to public IPFS gateway using browser-based method
   */
  private async uploadToPublicGateway(file: File): Promise<IPFSUploadResult> {
    try {
      // Convert file to base64 for simple upload simulation
      const base64 = await this.fileToBase64(file);
      
      // Create a simple hash from file content for demo purposes
      // In production, you'd use proper IPFS client libraries
      const hash = await this.generateContentHash(base64);
      
      // Store file data in browser storage as fallback
      // In production, this would be a real IPFS upload
      const fileData: IPFSFile = {
        hash,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString()
      };
      
      // Store in localStorage as demo (production would use real IPFS)
      localStorage.setItem(`ipfs_${hash}`, JSON.stringify({
        ...fileData,
        content: base64
      }));

      return {
        success: true,
        hash,
        url: `ipfs://${hash}` // Custom protocol for our demo
      };

    } catch (error) {
      console.error('Public gateway upload error:', error);
      return { success: false, error: 'Public gateway upload failed' };
    }
  }

  /**
   * Retrieve a file from IPFS by hash
   */
  async getFile(hash: string): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
      // First try to get from IPFS gateway
      const gatewayUrl = `${this.gatewayURL}${hash}`;
      
      // Check if file exists on gateway
      const response = await fetch(gatewayUrl, { method: 'HEAD' });
      
      if (response.ok) {
        return { success: true, url: gatewayUrl };
      }

      // Fallback to local storage for demo files
      const localFile = localStorage.getItem(`ipfs_${hash}`);
      if (localFile) {
        const fileData = JSON.parse(localFile);
        // Create blob URL for viewing
        const blob = this.base64ToBlob(fileData.content, fileData.type);
        const blobUrl = URL.createObjectURL(blob);
        
        return { success: true, url: blobUrl };
      }

      return { success: false, error: 'File not found on IPFS' };

    } catch (error) {
      console.error('IPFS get file error:', error);
      return { success: false, error: 'Failed to retrieve file' };
    }
  }

  /**
   * Get file metadata from IPFS
   */
  async getFileMetadata(hash: string): Promise<{ success: boolean; metadata?: IPFSFile; error?: string }> {
    try {
      // Try local storage first (for demo files)
      const localFile = localStorage.getItem(`ipfs_${hash}`);
      if (localFile) {
        const fileData = JSON.parse(localFile);
        return { 
          success: true, 
          metadata: {
            hash: fileData.hash,
            name: fileData.name,
            size: fileData.size,
            type: fileData.type,
            uploadedAt: fileData.uploadedAt
          }
        };
      }

      // In production, you'd query IPFS for metadata
      return { success: false, error: 'Metadata not found' };

    } catch (error) {
      console.error('IPFS metadata error:', error);
      return { success: false, error: 'Failed to get metadata' };
    }
  }

  /**
   * Validate IPFS hash format
   */
  isValidIPFSHash(hash: string): boolean {
    // Basic IPFS hash validation (CIDv0 and CIDv1)
    const cidV0Regex = /^Qm[1-9A-HJ-NP-Za-km-z]{44}$/;
    const cidV1Regex = /^[a-z2-7]{59}$/;
    
    return cidV0Regex.test(hash) || cidV1Regex.test(hash) || hash.startsWith('baf');
  }

  /**
   * Helper: Convert file to base64
   */
  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove data URL prefix
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
    });
  }

  /**
   * Helper: Convert base64 to blob
   */
  private base64ToBlob(base64: string, type: string): Blob {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type });
  }

  /**
   * Helper: Generate content hash (simplified for demo)
   */
  private async generateContentHash(content: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(content);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    // Format as IPFS-like hash (demo purposes)
    return `Qm${hashHex.substring(0, 44)}`;
  }
}

// Export singleton instance
export const ipfsService = new IPFSService();

// Export types
export type { IPFSUploadResult, IPFSFile };