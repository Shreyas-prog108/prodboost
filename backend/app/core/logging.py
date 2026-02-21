import logging
import json
from datetime import datetime, timezone

class JSONFormatter(logging.Formatter):
    """
    Formatter that outputs JSON strings after parsing the LogRecord.
    Useful for centralized log aggregators like Datadog/CloudWatch.
    """
    def format(self, record: logging.LogRecord) -> str:
        log_obj = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
        }
        
        # Include exception info if present
        if record.exc_info:
            log_obj["exception"] = self.formatException(record.exc_info)
            
        return json.dumps(log_obj)

def setup_logging():
    """Configures the root logger to output structured JSON to stdout."""
    root_logger = logging.getLogger()
    
    # Remove existing handlers to avoid duplicates
    for handler in root_logger.handlers[:]:
        root_logger.removeHandler(handler)
        
    handler = logging.StreamHandler()
    handler.setFormatter(JSONFormatter())
    
    root_logger.addHandler(handler)
    root_logger.setLevel(logging.INFO)
    
    # Optional: Suppress overly noisy standard library loggers
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
