#import "ShareModule.h"

@implementation ShareModule

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(getSharedData:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    NSUserDefaults *sharedDefaults = [[NSUserDefaults alloc] initWithSuiteName:@"group.com.dolfins.ai"];
    NSString *sharedURL = [sharedDefaults objectForKey:@"sharedURL"];
    NSString *sharedText = [sharedDefaults objectForKey:@"sharedText"];

    if (sharedURL || sharedText) {
        NSDictionary *result = @{
            @"sharedURL": sharedURL ?: [NSNull null],
            @"sharedText": sharedText ?: [NSNull null]
        };
        resolve(result);
    } else {
        reject(@"no_data", @"No data found", nil);
    }
}

@end
