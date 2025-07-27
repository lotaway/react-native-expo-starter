#import "Appsdk.h"
#import <React/RCTBridge.h>
#import <React/RCTViewManager.h>
#import <React/RCTView.h>

@implementation Appsdk
RCT_EXPORT_MODULE()

- (NSNumber *)multiply:(double)a b:(double)b {
    NSNumber *result = @(a * b);

    return result;
}

- (void)add:(double)a
b:(double)b
resolve:(RCTPromiseResolveBlock)resolve
reject:(RCTPromiseRejectBlock)reject {
  NSNumber *result = @(a+b);
  resolve(result);
}

- (void)startFaceDetection:(RCTResponseSenderBlock)callback) {
  dispatch_queue_t backgroundQueue = dispatch_get_global_queue()
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeAppsdkSpecJSI>(params);
}

@end
