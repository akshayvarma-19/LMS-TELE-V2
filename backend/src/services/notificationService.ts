import { supabase } from '../lib/supabase.js';

export interface NotificationRecord {
  id: string;
  user_id: string;
  type: 'ocr' | 'grievance' | 'land_record' | 'system';
  title: string;
  message: string;
  related_entity_type: string | null;
  related_entity_id: string | null;
  is_read: boolean;
  created_at: string;
}

export const notificationService = {
  /**
   * List all notifications for a specific user.
   * Dynamically auto-seeds sample notifications if the user currently has none.
   */
  async listNotifications(userId: string): Promise<NotificationRecord[]> {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to list notifications: ${error.message}`);
    }

    if (!data || data.length === 0) {
      console.log(`Auto-seeding notifications for user: ${userId}`);
      return this.autoSeedNotifications(userId);
    }

    return data;
  },

  /**
   * Mark a notification as read.
   */
  async markAsRead(notificationId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId)
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Failed to mark notification as read: ${error.message}`);
    }
  },

  /**
   * Dynamically create a new notification.
   */
  async createNotification(
    userId: string,
    type: 'ocr' | 'grievance' | 'land_record' | 'system',
    title: string,
    message: string,
    relatedEntityType?: string,
    relatedEntityId?: string
  ): Promise<NotificationRecord> {
    const { data, error } = await supabase
      .from('notifications')
      .insert([
        {
          user_id: userId,
          type,
          title,
          message,
          related_entity_type: relatedEntityType || null,
          related_entity_id: relatedEntityId || null,
          is_read: false
        }
      ])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create notification: ${error.message}`);
    }

    return data;
  },

  /**
   * Helper to seed standard notifications for a new or empty user profile.
   */
  async autoSeedNotifications(userId: string): Promise<NotificationRecord[]> {
    const sampleNotifications = [
      {
        user_id: userId,
        type: 'ocr',
        title: 'OCR Verification Mismatch',
        message: 'A discrepancy was flagged between your uploaded deed document and the official registry. Specifically, Survey Number and Land Extent fields show inconsistencies. You may raise a grievance petition to resolve this.',
        related_entity_type: 'land_documents',
        is_read: false
      },
      {
        user_id: userId,
        type: 'grievance',
        title: 'Grievance Under Review',
        message: 'Your boundary dispute petition has been assigned to Revenue Officer Deshana and is currently marked as In Progress.',
        related_entity_type: 'grievances',
        is_read: false
      },
      {
        user_id: userId,
        type: 'system',
        title: 'Welcome to TRACIA',
        message: 'Welcome to the TRACIA PS-09 Digital Land Record Management Portal. You can easily view land registry records, upload land deeds for automated OCR matching, and track grievance resolutions.',
        related_entity_type: null,
        is_read: false
      }
    ];

    const { data, error } = await supabase
      .from('notifications')
      .insert(sampleNotifications)
      .select();

    if (error) {
      console.error('Warning: Failed to auto-seed notifications:', error.message);
      return [];
    }

    // Sort descending by created_at (or array order is fine, but select default order is fine)
    return (data || []).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }
};
