// components/streams/MessageSender.jsx - Updated
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { FaPaperPlane, FaCode, FaPlug } from 'react-icons/fa';

const MessageSender = ({ onSendMessage, canWrite, connectionStatus }) => {
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [valueError, setValueError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!key.trim() || !value.trim()) {
      return;
    }

    // Parse value as number before sending; surface a small inline error
    // under the Value input instead of a blocking alert.
    const numericValue = parseFloat(value);
    if (isNaN(numericValue)) {
      setValueError('Value must be a number');
      return;
    }
    setValueError('');

    setLoading(true);
    
    try {
      const success = await onSendMessage(key, numericValue);
      if (success) {
        setKey('');
        setValue('');
      }
    } catch (err) {
      console.error('Error sending message:', err);
      toast.error('Message could not be sent. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!canWrite) {
    return (
      <div className="bg-dark-card rounded-xl border border-white/10 p-5">
        <div className="text-center py-4">
          <FaCode className="w-8 h-8 mx-auto mb-2 text-gray-500" />
          <p className="text-gray-text">Write access required to send messages</p>
        </div>
      </div>
    );
  }

  if (connectionStatus !== 'connected') {
    return (
      <div className="bg-dark-card rounded-xl border border-white/10 p-5">
        <div className="text-center py-4">
          <FaPlug className="w-8 h-8 mx-auto mb-2 text-gray-500" />
          <p className="text-gray-text">Connect to stream to send messages</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-dark-card rounded-xl border border-white/10 p-5">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <FaPaperPlane /> Send Message
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-text text-sm mb-2">Key</label>
          <input
            type="text"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="temperature"
            className="w-full p-3 bg-dark-bg rounded-lg border border-white/10 text-light-text focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent"
            required
          />
        </div>
        
        <div>
          <label className="block text-gray-text text-sm mb-2">Value (number)</label>
          <input
            type="text"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (valueError) setValueError('');
            }}
            placeholder="23.5"
            className={`w-full p-3 bg-dark-bg rounded-lg border text-light-text focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent ${
              valueError ? 'border-red-500' : 'border-white/10'
            }`}
            required
          />
          {valueError && <p className="text-red-400 text-xs mt-1">{valueError}</p>}
        </div>

        <button
          type="submit"
          disabled={loading || !key.trim() || !value.trim()}
          className="w-full py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              Sending...
            </>
          ) : (
            <>
              <FaPaperPlane className="w-4 h-4" />
              Send Message
            </>
          )}
        </button>

        <div className="text-xs text-gray-text mt-2">
          <p>Message format: {"{key: string, timestamp: float, value: float}"}</p>
          <p>Timestamp is automatically set to current time</p>
        </div>
      </form>
    </div>
  );
};

export default MessageSender;