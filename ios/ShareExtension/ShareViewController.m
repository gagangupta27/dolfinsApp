#import <Social/Social.h>
#import <UniformTypeIdentifiers/UniformTypeIdentifiers.h> // Import the new framework

@interface ShareViewController : SLComposeServiceViewController

@end

@implementation ShareViewController

- (BOOL)isContentValid {
    // Validate content if necessary
    return YES;
}

- (void)didSelectPost {
    NSExtensionItem *item = self.extensionContext.inputItems.firstObject;
    NSItemProvider *itemProvider = item.attachments.firstObject;

    if ([itemProvider hasItemConformingToTypeIdentifier:UTTypeURL.identifier]) {  // Updated constant
        [itemProvider loadItemForTypeIdentifier:UTTypeURL.identifier options:nil completionHandler:^(NSURL *url, NSError *error) {
            if (url) {
                [self handleSharedURL:url];
            }
        }];
    } else if ([itemProvider hasItemConformingToTypeIdentifier:UTTypePlainText.identifier]) {  // Updated constant
        [itemProvider loadItemForTypeIdentifier:UTTypePlainText.identifier options:nil completionHandler:^(NSString *text, NSError *error) {
            if (text) {
                [self handleSharedText:text];
            }
        }];
    }

    [self.extensionContext completeRequestReturningItems:@[] completionHandler:nil];
}

- (void)handleSharedURL:(NSURL *)url {
    NSLog(@"Shared URL: %@", url.absoluteString);
    // Pass URL to main app via shared container or user defaults
}

- (void)handleSharedText:(NSString *)text {
    NSLog(@"Shared Text: %@", text);
    // Pass text to main app via shared container or user defaults
}

- (NSArray *)configurationItems {
    return @[];
}

@end

